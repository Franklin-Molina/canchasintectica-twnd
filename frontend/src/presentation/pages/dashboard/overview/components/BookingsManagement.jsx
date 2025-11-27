import React from 'react';
import { Calendar, Filter, Plus } from 'lucide-react';
import BookingTable from '../../../../components/Bookings/BookingTable.jsx';
import FilterPanel from '../../../../components/Dashboard/FilterPanel.jsx';
import { useFetchBookings } from '../../../../hooks/bookings/useFetchBookings.js';
import { useFetchAllCourts } from '../../../../hooks/courts/useFetchAllCourts.js';

const BookingsManagement = () => {
  const {
    bookings,
    loading: loadingBookings,
    error: errorBookings,
    currentPage: bookingsCurrentPage,
    totalPages: bookingsTotalPages,
    setCurrentPage: setBookingsCurrentPage,
    deleteBooking,
    itemsPerPage,
    setItemsPerPage,
    totalBookings,
    searchFilter: bookingSearchFilter,
    setSearchFilter: setBookingSearchFilter,
    paymentStatusFilter: bookingPaymentStatusFilter,
    setPaymentStatusFilter: setBookingPaymentStatusFilter,
    selectedCourtFilter: bookingCourtFilter,
    setSelectedCourtFilter: setBookingCourtFilter,
    clearFilters: clearBookingFilters,
  } = useFetchBookings({ onlyActive: true });

  const { courts: allCourts } = useFetchAllCourts();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const courtOptions = [
    { value: 'all', label: 'Todas las canchas' },
    ...allCourts.map(court => ({ value: court.id, label: court.name })),
  ];

  const bookingFilters = [
    { id: 'search', label: 'Buscar', type: 'text', placeholder: 'Buscar por cancha o usuario...', value: bookingSearchFilter },
    { id: 'court', label: 'Cancha', type: 'select', options: courtOptions, value: bookingCourtFilter },
    { id: 'paymentStatus', label: 'Estado de Pago', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'pagado', label: 'Pagado' }, { value: 'pendiente', label: 'Pendiente' }], value: bookingPaymentStatusFilter },
  ];

  const handleFilterChange = (filterId, value) => {
    if (filterId === 'search') setBookingSearchFilter(value);
    if (filterId === 'court') setBookingCourtFilter(value);
    if (filterId === 'paymentStatus') setBookingPaymentStatusFilter(value);
    setBookingsCurrentPage(1);
  };

  const activeFilterCount = (bookingSearchFilter ? 1 : 0) + (bookingPaymentStatusFilter !== 'all' ? 1 : 0) + (bookingCourtFilter !== 'all' ? 1 : 0);

  if (loadingBookings) return <div>Cargando reservas...</div>;
  if (errorBookings) return <div>Error al cargar reservas: {errorBookings.message}</div>;

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Reservas</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra y controla las reservas de tus canchas</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-300 dark:border-slate-700">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button onClick={() => {}} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-emerald-600/20">
              <Plus className="w-4 h-4" />
              Nueva Reserva
            </button>
          </div>
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={bookingFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearBookingFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="overflow-x-visible">
        <BookingTable
          bookings={bookings}
          currentPage={bookingsCurrentPage}
          totalPages={bookingsTotalPages}
          setCurrentPage={setBookingsCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalBookings={totalBookings}
          deleteBooking={deleteBooking}
        />
      </div>
    </div>
  );
};

export default BookingsManagement;
