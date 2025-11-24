import React, { useMemo } from 'react';
import Spinner from '../../../components/common/Spinner';
import BookingTable from '../../../components/Dashboard/BookingTable';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings';
import { RefreshCw } from 'lucide-react'; // Importar el icono de refrescar

function DashboardBookingsPage() {
  const {
    bookings, // Ahora 'bookings' ya viene paginado y filtrado
    loading,
    error,
    currentPage,
    totalPages, // Total de páginas calculado en el hook
    totalBookings, // Total de reservas después de aplicar filtros
    setCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
    fetchAllBookings, // Función para refrescar reservas
  } = useFetchBookings({ onlyActive: true, initialItemsPerPage: 10 }); // Pasamos onlyActive: true y initialItemsPerPage: 10 al hook

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
      <div className="flex justify-between items-center mb-6"> {/* Contenedor para título y botón */}
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Gestión de Reservas
        </h1>
        <button
          onClick={fetchAllBookings} // Llamada directa a la función de refresco
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all bg-blue-500 text-white hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refrescar</span>
        </button>
      </div>

      {totalBookings === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          No hay reservas activas.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              Reservas Activas
            </h2>
          </div>
          <BookingTable
            bookings={bookings} // Usamos directamente las reservas que ya vienen paginadas
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalBookings={totalBookings} // Usamos el total de reservas filtradas del hook
            deleteBooking={deleteBooking}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardBookingsPage;
