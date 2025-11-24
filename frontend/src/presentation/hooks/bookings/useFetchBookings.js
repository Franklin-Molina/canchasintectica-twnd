import { useState, useEffect, useMemo } from 'react';
import { useUseCases } from '../../context/UseCaseContext';

/**
 * Hook personalizado para obtener la lista de reservas con paginación del lado del cliente.
 * @param {{ onlyActive?: boolean, onlyFinished?: boolean, initialItemsPerPage?: number }} options Opciones para configurar el hook.
 * @returns {object} Un objeto con los datos de paginación y funciones.
 */
export const useFetchBookings = ({ onlyActive = false, onlyFinished = false, initialItemsPerPage = 5 } = {}) => {
  const [allBookings, setAllBookings] = useState([]); // Almacena todas las reservas sin filtrar ni paginar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchFilter, setSearchFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all'); // 'all', 'pagado', 'pendiente'
  const [selectedCourtFilter, setSelectedCourtFilter] = useState('all'); // 'all' o el ID de una cancha

  const { getBookingsUseCase, deleteBookingUseCase } = useUseCases();

  const filteredBookings = useMemo(() => {
    let bookingsToFilter = allBookings;

    if (onlyActive) {
      const now = new Date();
      bookingsToFilter = bookingsToFilter.filter(booking => new Date(booking.end_time) >= now);
    }

    if (onlyFinished) {
      const now = new Date();
      bookingsToFilter = bookingsToFilter.filter(booking => new Date(booking.end_time) < now);
    }

    return bookingsToFilter.filter(booking => {
      const courtName = booking.court_details?.name || '';
      const userName = `${booking.user_details?.first_name || ''} ${booking.user_details?.last_name || ''}`.trim();
      const paymentStatus = booking.payment || '';

      const searchMatch = searchFilter === '' ||
        courtName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        userName.toLowerCase().includes(searchFilter.toLowerCase());
      
      const paymentStatusMatch = paymentStatusFilter === 'all' || paymentStatus.toLowerCase() === paymentStatusFilter;

      const courtMatch = selectedCourtFilter === 'all' || booking.court_details?.id === selectedCourtFilter;

      return searchMatch && paymentStatusMatch && courtMatch;
    });
  }, [allBookings, searchFilter, paymentStatusFilter, selectedCourtFilter, onlyActive, onlyFinished]); // Agregado onlyFinished a las dependencias

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      // El backend no pagina, así que obtenemos todo
      const response = await getBookingsUseCase.execute(1);
      setAllBookings(response || []);
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

  // Calcular las reservas paginadas y el total de páginas basado en filteredBookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [currentPage, filteredBookings, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredBookings?.length || 0) / itemsPerPage);
  }, [filteredBookings, itemsPerPage]);

  const clearFilters = () => {
    setSearchFilter('');
    setPaymentStatusFilter('all');
    setSelectedCourtFilter('all');
    setCurrentPage(1);
  };

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
    bookings: paginatedBookings, // Devolvemos solo las reservas paginadas y filtradas
    loading,
    error,
    currentPage,
    totalPages,
    totalBookings: filteredBookings.length, // Total de reservas después de filtrar
    setCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
    searchFilter,
    setSearchFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    selectedCourtFilter,
    setSelectedCourtFilter,
    clearFilters,
    fetchAllBookings, // Exportar la función para refrescar
  };
};
