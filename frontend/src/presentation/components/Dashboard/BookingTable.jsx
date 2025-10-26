import React from 'react';
import Swal from 'sweetalert2';
import ProfessionalPagination from '../common/ProfessionalPagination.jsx';

const BookingTable = ({
  bookings,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalBookings,
  deleteBooking,
}) => {
  const handleCancelBooking = (bookingId) => {
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
        Swal.fire('¡Cancelada!', 'La reserva ha sido cancelada.', 'success');
      }
    });
  };

  const getEstadoColor = (estado) => {
    const colors = {
      'Activa': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Inactiva': 'bg-slate-100 text-slate-700 border-slate-200',
      'Confirmada': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
      'Cancelada': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <table className="w-full">
        <thead className="bg-slate-100/50 dark:bg-slate-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cancha</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Inicio</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fin</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pago</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {bookings.map((booking, index) => (
            <tr key={booking.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{booking.court_details.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{booking.user_details.first_name} {booking.user_details.last_name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(booking.start_time).toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{new Date(booking.end_time).toLocaleString()}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold text-right">{booking.payment}</td>
              <td className="px-6 py-4 text-right flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Modificar
                </button>
                <button onClick={() => handleCancelBooking(booking.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProfessionalPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalBookings}
      />
    </div>
  );
};

export default BookingTable;
