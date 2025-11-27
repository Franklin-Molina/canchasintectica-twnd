import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, BarChart3, Calendar, MapPin, Filter, Plus } from 'lucide-react';
import CourtTable from '../../../components/Courts/CourtTable.jsx';
import BookingTable from '../../../components/Bookings/BookingTable.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import FilterPanel from '../../../components/Dashboard/FilterPanel.jsx';
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
    fetchAllCourts, // Obtener la función para recargar canchas
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
    fetchAllBookings, // Obtener la función para recargar reservas
  } = useFetchBookings({ onlyActive: true });

  const { courts: allCourts } = useFetchAllCourts();

  const { stats: userStats, loading: loadingUserStats, error: errorUserStats } = useUserStats();
  const { stats: bookingStats, loading: loadingBookingStats, error: errorBookingStats } = useBookingStats();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('canchas'); // 'canchas' o 'reservas'

  const refreshData = useCallback(() => {
    if (activeTab === 'canchas') {
      fetchAllCourts();
    } else {
      fetchAllBookings();
    }
  }, [activeTab, fetchAllCourts, fetchAllBookings]);

  const { timeSinceLastUpdate } = useAutoRefresh(fetchAllBookings, 10000, bookings);

  useEffect(() => {
    setCourtsItemsPerPage(5);
  }, [setCourtsItemsPerPage]);



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

  const isReservasTab = activeTab === 'reservas';
  const loading = isReservasTab ? loadingBookings : loadingCourts;
  const error = isReservasTab ? errorBookings : errorCourts;
  const totalPages = isReservasTab ? bookingsTotalPages : courtsTotalPages;
  const currentPage = isReservasTab ? bookingsCurrentPage : courtsCurrentPage;
  const setCurrentPage = isReservasTab ? setBookingsCurrentPage : setCourtsCurrentPage;

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error.message}</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="flex justify-end w-full items-center mb-6">
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/30 px-5 py-3 rounded-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="text-green-500 font-medium text-sm">Sistema Activo</div>
              <div className="text-xs text-gray-400">
                Última actualización: {timeSinceLastUpdate}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">INGRESOS TOTALES</div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">$24,580</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>8.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">NUEVOS USUARIOS</div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            {loadingUserStats ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">Cargando...</div>
              </div>
            ) : errorUserStats ? (
              <div className="space-y-2">
                 <div className="text-sm font-bold text-red-500 dark:text-red-400">Error al cargar</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{userStats?.total_users.toLocaleString() || 'N/A'}</div>
                <div className={`flex items-center gap-1 text-sm ${userStats?.percentage_change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {userStats?.percentage_change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{userStats?.percentage_change.toFixed(1) || '0.0'}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">RESERVAS</div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            {loadingBookingStats ? (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">Cargando...</div>
              </div>
            ) : errorBookingStats ? (
              <div className="space-y-2">
                <div className="text-sm font-bold text-red-500 dark:text-red-400">Error al cargar</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{bookingStats?.total_bookings.toLocaleString() || 'N/A'}</div>
                <div className={`flex items-center gap-1 text-sm ${bookingStats?.percentage_change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {bookingStats?.percentage_change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{bookingStats?.percentage_change.toFixed(1) || '0.0'}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">CRECIMIENTO</div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">15.8%</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>5.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header with Tabs */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeTab === 'canchas' ? 'Gestión de Canchas' : 'Gestión de Reservas'}
                  </h2>

                </div>
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

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 mt-6 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab('canchas');
                  setCourtsCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'canchas'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                <MapPin className="w-4 h-4" />
                Canchas
              </button>
              <button
                onClick={() => {
                  setActiveTab('reservas');
                  setBookingsCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'reservas'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
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

          {/* Table */}
          <div className="overflow-x-visible">
            {activeTab === 'canchas' ? (
              <CourtTable
                courts={courts}
                onModify={handleModifyRequest}
                onDelete={handleDeleteRequest}
                onToggleActive={async (courtId, isActive) => {
                  if (isActive) {
                    await handleReactivateCourtClick(courtId);
                  } else {
                    await handleSuspendCourtClick(courtId);
                  }
                }}
                currentPage={courtsCurrentPage}
                totalPages={courtsTotalPages}
                setCurrentPage={setCourtsCurrentPage}
                itemsPerPage={courtsItemsPerPage}
                setItemsPerPage={setCourtsItemsPerPage}
                totalCourts={totalCourts}
              />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverviewPage;