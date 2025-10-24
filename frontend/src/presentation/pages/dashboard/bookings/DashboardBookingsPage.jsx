import React from 'react';
import Spinner from '../../../components/common/Spinner';
import ProfessionalPagination from '../../../components/common/ProfessionalPagination';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings';
import Swal from 'sweetalert2';

function DashboardBookingsPage() {
  const {
    bookings,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
    totalBookings,
  } = useFetchBookings();

  const handleCancel = (bookingId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No, mantener reserva',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBooking(bookingId);
        Swal.fire(
          '¡Cancelada!',
          'La reserva ha sido cancelada.',
          'success'
        );
      }
    });
  };

  // Calcular el índice inicial para la numeración continua
  const getRowNumber = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400">
        Error al cargar reservas: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Título principal */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Gestión de Reservas
      </h1>

      {/* Contenido principal */}
      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          No hay reservas registradas.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Encabezado de widget */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Lista de Reservas
            </h2>
          </div>

          {/* Tabla con scroll responsivo */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Cancha</th>
                  <th className="px-6 py-3">Usuario</th>
                  <th className="px-6 py-3">Inicio</th>
                  <th className="px-6 py-3">Fin</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3">Pago</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {/* Numeración continua usando getRowNumber */}
                    <td className="px-6 py-3 text-gray-800 dark:text-gray-100 font-medium">
                      {getRowNumber(index)}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {booking.court_details.name}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {booking.user_details.first_name} {booking.user_details.last_name}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(booking.start_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(booking.end_time).toLocaleString()}
                    </td>

                    {/* Estado con color dinámico */}
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completada'
                            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'
                            : booking.status === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    {/* Estado del pago */}
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.payment === 'pagado'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {booking.payment}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        // onClick={() => handleModify(booking.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <ProfessionalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={totalBookings}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardBookingsPage;
