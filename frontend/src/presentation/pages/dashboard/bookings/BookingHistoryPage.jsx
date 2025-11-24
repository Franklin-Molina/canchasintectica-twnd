import React, { useMemo } from 'react';
import Spinner from '../../../components/common/Spinner';
import BookingTable from '../../../components/Dashboard/BookingTable';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings';

function BookingHistoryPage() {
  const {
    bookings, // Ahora 'bookings' ya viene paginado y filtrado como historial
    loading,
    error,
    currentPage,
    setCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
    totalPages, // Total de páginas calculadas por el hook
    totalBookings, // Total de reservas después de filtrar por historial
  } = useFetchBookings({ onlyFinished: true, itemsPerPage: 10 }); // Forzar itemsPerPage a 10

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
        Error al cargar el historial de reservas: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Historial de Reservas
      </h1>

      {totalBookings === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          No hay reservas finalizadas en el historial.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Reservas Finalizadas
            </h2>
          </div>
          <BookingTable
            bookings={bookings} // Usar directamente las reservas paginadas del hook
            currentPage={currentPage}
            totalPages={totalPages} // Usar totalPages del hook
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalBookings={totalBookings} // Usar totalBookings del hook
            deleteBooking={deleteBooking}
          />
        </div>
      )}
    </div>
  );
}

export default BookingHistoryPage;
