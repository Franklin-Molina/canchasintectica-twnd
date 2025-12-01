import { useEffect, useRef } from 'react';
import { useUseCases } from '../../context/UseCaseContext';
import { useNotification } from '../../context/NotificationContext';

/**
 * Hook para monitorizar nuevas reservas en segundo plano y mostrar notificaciones.
 */
export const useBookingNotifier = (enabled = false) => {
  const { getBookingsUseCase } = useUseCases();
  const { showNotification } = useNotification();
  const bookingsRef = useRef([]);

  useEffect(() => {
    if (!enabled) {
      return; // No hacer nada si el hook no está habilitado
    }

    const fetchAndNotify = async () => {
      try {
        const newBookingsData = await getBookingsUseCase.execute(1) || [];

        if (bookingsRef.current.length > 0 && newBookingsData.length > bookingsRef.current.length) {
          const prevBookingIds = new Set(bookingsRef.current.map(b => b.id));
          const newlyAddedBooking = newBookingsData.find(b => !prevBookingIds.has(b.id));

          if (newlyAddedBooking) {
            const userName = `${newlyAddedBooking.user_details?.first_name || 'Alguien'} ${newlyAddedBooking.user_details?.last_name || ''}`.trim();
            const courtName = newlyAddedBooking.court_details?.name || 'una cancha';
            showNotification(`${userName} reservó ${courtName}`);
          }
        }
        bookingsRef.current = newBookingsData;
      } catch (error) {
        console.error('Error al verificar nuevas reservas:', error);
      }
    };

    // Carga inicial solo si está habilitado
    getBookingsUseCase.execute(1).then(initialBookings => {
      bookingsRef.current = initialBookings || [];
    });

    const interval = setInterval(fetchAndNotify, 10000);

    return () => clearInterval(interval);
  }, [enabled, getBookingsUseCase, showNotification]);
};
