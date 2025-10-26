import React from 'react';
import Spinner from '../../../components/common/Spinner';
import BookingTable from '../../../components/Dashboard/BookingTable';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings';

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
          <BookingTable
            bookings={bookings}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalBookings={totalBookings}
            deleteBooking={deleteBooking}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardBookingsPage;
