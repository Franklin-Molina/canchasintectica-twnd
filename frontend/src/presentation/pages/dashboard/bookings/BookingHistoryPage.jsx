import React, { useMemo } from 'react';
import Spinner from '../../../components/common/Spinner';
import BookingTable from '../../../components/Dashboard/BookingTable';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings';

function BookingHistoryPage() {
  const {
    bookings: allBookings,
    loading,
    error,
    currentPage,
    setCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
  } = useFetchBookings();

  const historyBookings = useMemo(() => {
    const now = new Date();
    // Filtramos para mostrar solo las reservas cuya fecha de finalización ya pasó
    return allBookings.filter(booking => new Date(booking.end_time) < now);
  }, [allBookings]);

  // Lógica de paginación sobre los datos del historial
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return historyBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [historyBookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(historyBookings.length / itemsPerPage);

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

      {historyBookings.length === 0 ? (
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
            bookings={paginatedBookings}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalBookings={historyBookings.length}
            deleteBooking={deleteBooking}
          />
        </div>
      )}
    </div>
  );
}

export default BookingHistoryPage;
