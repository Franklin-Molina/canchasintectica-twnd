import { useState, useEffect } from 'react';
import { useUseCases } from '../../context/UseCaseContext';

const ITEMS_PER_PAGE = 10; // Define cuántos elementos mostrar por página

/**
 * Hook personalizado para obtener la lista de reservas con paginación del lado del cliente.
 * @returns {object} Un objeto con los datos de paginación y funciones.
 */
export const useFetchBookings = () => {
  const [allBookings, setAllBookings] = useState([]); // Almacena todas las reservas
  const [displayedBookings, setDisplayedBookings] = useState([]); // Almacena las reservas para la página actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { getBookingsUseCase, deleteBookingUseCase } = useUseCases();

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      // El backend no pagina, así que obtenemos todo
      const response = await getBookingsUseCase.execute(1);
      setAllBookings(response || []);
      setTotalPages(Math.ceil((response?.length || 0) / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err);
      console.error('Error al obtener reservas en useFetchBookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para obtener todas las reservas una sola vez
  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Efecto para actualizar las reservas mostradas cuando cambia la página o los datos
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedBookings(allBookings.slice(startIndex, endIndex));
  }, [currentPage, allBookings]);

  const deleteBooking = async (bookingId) => {
    try {
      await deleteBookingUseCase.execute(bookingId);
      // Refrescar la lista de reservas después de eliminar
      await fetchAllBookings();
    } catch (err) {
      console.error(`Error al eliminar la reserva ${bookingId}:`, err);
      // Opcional: manejar el estado de error para mostrarlo en la UI
      setError(err);
    }
  };

  return {
    bookings: displayedBookings, // Devuelve la lista paginada
    loading,
    error,
    currentPage,
    totalPages,
    totalBookings: allBookings.length, // Devuelve el conteo total
    setCurrentPage,
    deleteBooking,
  };
};
