from rest_framework import serializers
from rest_framework.exceptions import ValidationError # Importar ValidationError
from .models import Booking
from users.models import User # Importar el modelo User
from courts.models import Court # Importar el modelo Court
from courts.serializers import CourtSerializer # Importar CourtSerializer
from users.serializers import UserSerializer # Importar UserSerializer
from django.utils import timezone # Importar timezone

class BookingSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True) # Añadir serializador anidado para el usuario
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        default=serializers.CurrentUserDefault(),
        write_only=True # Hacer que el campo 'user' sea solo de escritura para evitar conflictos
    )
    court_details = CourtSerializer(source='court', read_only=True)
    court = serializers.PrimaryKeyRelatedField(
        queryset=Court.objects.all(), write_only=True
    )

    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    payment_percentage = serializers.IntegerField(required=False, default=100, min_value=10, max_value=100) # Nuevo campo para el porcentaje de pago

    class Meta:
        model = Booking
        fields = ('id', 'user', 'user_details', 'court', 'court_details', 'start_time', 'end_time', 'status', 'payment', 'payment_percentage', 'created_at')

    def create(self, validated_data):
        # Obtener el usuario del contexto de la petición (establecido por CurrentUserDefault)
        user = validated_data.pop('user')
        court = validated_data.pop('court')
        payment_percentage = validated_data.pop('payment_percentage', 100) # Extraer el porcentaje de pago

        # Crear un diccionario con los datos que espera el caso de uso/repositorio
        booking_data_for_use_case = {
            'user': user,
            'court': court,
            'start_time': validated_data['start_time'],
            'end_time': validated_data['end_time'],
            'payment_percentage': payment_percentage,
        }
        
        # Importar el caso de uso aquí para evitar importaciones circulares
        from backend.bookings.application.use_cases.create_booking import CreateBookingUseCase
        from backend.bookings.infrastructure.repositories.django_booking_repository import DjangoBookingRepository
        
        booking_repository = DjangoBookingRepository()
        create_booking_use_case = CreateBookingUseCase(booking_repository)

        # Ejecutar el caso de uso para crear la reserva
        # Usamos async_to_sync porque el serializer es síncrono y el caso de uso es asíncrono
        from asgiref.sync import async_to_sync
        booking = async_to_sync(create_booking_use_case.execute)(booking_data_for_use_case)
        return booking

    def validate(self, data):
        """
        Valida que la cancha no esté reservada en el rango de tiempo solicitado.
        """
        user = data.get('user') 
        if not user:
            raise ValidationError("El usuario no está autenticado.")

        court = data.get('court')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if not court or not start_time or not end_time:
            return data

        instance = self.instance
        if instance:
            overlapping_bookings = Booking.objects.filter(
                court=court,
                start_time__lt=end_time,
                end_time__gt=start_time,
                status__in=['pending', 'confirmed']
            ).exclude(pk=instance.pk)
        else:
            overlapping_bookings = Booking.objects.filter(
                court=court,
                start_time__lt=end_time,
                end_time__gt=start_time,
                status__in=['pending', 'confirmed']
            )

        if overlapping_bookings.exists():
            raise ValidationError("La cancha no está disponible en el rango de tiempo solicitado.")

        if start_time >= end_time:
             raise ValidationError({'end_time': 'La hora de fin debe ser posterior a la hora de inicio.'})

        return data
