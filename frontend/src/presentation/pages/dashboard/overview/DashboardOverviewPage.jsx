import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Plus, MapPin, Calendar } from 'lucide-react';
import Spinner from '../../../components/common/Spinner.jsx';
import FilterPanel from '../../../components/Dashboard/FilterPanel.jsx';
import StatCards from '../../../components/Dashboard/overview/StatCards.jsx';
import CourtsManagement from '../../../components/Dashboard/overview/CourtsManagement.jsx';
import BookingsManagement from '../../../components/Dashboard/overview/BookingsManagement.jsx';
import SystemStatus from '../../../components/Dashboard/overview/SystemStatus.jsx';
import { useManageCourtsLogic } from '../../../hooks/courts/useManageCourtsLogic.js';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings.js';
import { useFetchAllCourts } from '../../../hooks/courts/useFetchAllCourts.js';
import { useAutoRefresh } from '../../../hooks/bookings/useAutoRefresh.js';
import useUserStats from '../../../hooks/users/useUserStats.js';
import useBookingStats from '../../../hooks/bookings/useBookingStats.js';

function DashboardOverviewPage() {
  const {
    courts,
    loading: loadingCourts,
    error: errorCourts,
    handleModifyRequest,
    handleDeleteRequest,
    handleSuspendCourtClick,
    handleReactivateCourtClick,
    currentPage: courtsCurrentPage,
    setCurrentPage: setCourtsCurrentPage,
    totalPages: courtsTotalPages,
    itemsPerPage: courtsItemsPerPage,
    setItemsPerPage: setCourtsItemsPerPage,
    totalCourts,
    nameFilter: courtNameFilter,
    setNameFilter: setCourtNameFilter,
    statusFilter: courtStatusFilter,
    setStatusFilter: setCourtStatusFilter,
    clearFilters: clearCourtFilters,
    fetchAllCourts,
  } = useManageCourtsLogic();

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
    fetchAllBookings,
  } = useFetchBookings({ onlyActive: true });

  const { courts: allCourts } = useFetchAllCourts();
  const { stats: userStats, loading: loadingUserStats, error: errorUserStats } = useUserStats();
  const { stats: bookingStats, loading: loadingBookingStats, error: errorBookingStats } = useBookingStats();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('canchas');

  const refreshData = useCallback(() => {
    if (activeTab === 'canchas') {
      fetchAllCourts();
    } else {
      fetchAllBookings();
    }
  }, [activeTab, fetchAllCourts, fetchAllBookings]);

  const { timeSinceLastUpdate } = useAutoRefresh(refreshData, 10000, activeTab === 'canchas' ? courts : bookings);

  const navigate = useNavigate();

  const courtFilters = [
    { id: 'name', label: 'Nombre', type: 'text', placeholder: 'Buscar por nombre...', value: courtNameFilter },
    { id: 'status', label: 'Estado', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'active', label: 'Activa' }, { value: 'inactive', label: 'Inactiva' }], value: courtStatusFilter },
  ];

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
    if (activeTab === 'canchas') {
      if (filterId === 'name') setCourtNameFilter(value);
      if (filterId === 'status') setCourtStatusFilter(value);
      setCourtsCurrentPage(1);
    } else {
      if (filterId === 'search') setBookingSearchFilter(value);
      if (filterId === 'court') setBookingCourtFilter(value);
      if (filterId === 'paymentStatus') setBookingPaymentStatusFilter(value);
      setBookingsCurrentPage(1);
    }
  };

  const activeFilterCount = activeTab === 'canchas'
    ? (courtNameFilter ? 1 : 0) + (courtStatusFilter !== 'all' ? 1 : 0)
    : (bookingSearchFilter ? 1 : 0) + (bookingPaymentStatusFilter !== 'all' ? 1 : 0) + (bookingCourtFilter !== 'all' ? 1 : 0);

  const handleCreateCourtClick = () => {
    navigate('/dashboard/canchas/create');
  };

  const loading = activeTab === 'reservas' ? loadingBookings : loadingCourts;
  const error = activeTab === 'reservas' ? errorBookings : errorCourts;

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error.message}</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        <SystemStatus timeSinceLastUpdate={timeSinceLastUpdate} />
        
        <StatCards
          userStats={userStats}
          bookingStats={bookingStats}
          loadingUserStats={loadingUserStats}
          errorUserStats={errorUserStats}
          loadingBookingStats={loadingBookingStats}
          errorBookingStats={errorBookingStats}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeTab === 'canchas' ? 'Gestión de Canchas' : 'Gestión de Reservas'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {activeTab === 'canchas'
                    ? 'Administra y controla tus espacios deportivos'
                    : 'Administra y controla las reservas de tus canchas'}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-300 dark:border-slate-700">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
                <button
                  onClick={activeTab === 'canchas' ? handleCreateCourtClick : () => { }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-emerald-600/20">
                  <Plus className="w-4 h-4" />
                  {activeTab === 'canchas' ? 'Nueva Cancha' : 'Nueva Reserva'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => { setActiveTab('canchas'); setCourtsCurrentPage(1); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'canchas' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <MapPin className="w-4 h-4" />
                Canchas
              </button>
              <button
                onClick={() => { setActiveTab('reservas'); setBookingsCurrentPage(1); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'reservas' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <Calendar className="w-4 h-4" />
                Reservas
              </button>
            </div>
          </div>

          <FilterPanel
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={activeTab === 'canchas' ? courtFilters : bookingFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={activeTab === 'canchas' ? clearCourtFilters : clearBookingFilters}
            activeFilterCount={activeFilterCount}
          />

          <div className="overflow-x-visible">
            {activeTab === 'canchas' ? (
              <CourtsManagement
                courts={courts}
                handleModifyRequest={handleModifyRequest}
                handleDeleteRequest={handleDeleteRequest}
                handleSuspendCourtClick={handleSuspendCourtClick}
                handleReactivateCourtClick={handleReactivateCourtClick}
                courtsCurrentPage={courtsCurrentPage}
                setCourtsCurrentPage={setCourtsCurrentPage}
                courtsTotalPages={courtsTotalPages}
                courtsItemsPerPage={courtsItemsPerPage}
                setCourtsItemsPerPage={setCourtsItemsPerPage}
                totalCourts={totalCourts}
              />
            ) : (
              <BookingsManagement
                bookings={bookings}
                bookingsCurrentPage={bookingsCurrentPage}
                bookingsTotalPages={bookingsTotalPages}
                setBookingsCurrentPage={setBookingsCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalBookings={totalBookings}
                deleteBooking={deleteBooking}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverviewPage;
