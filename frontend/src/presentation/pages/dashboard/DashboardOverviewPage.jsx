import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, BarChart3, Calendar, MapPin, Filter, Plus } from 'lucide-react';
import CourtTable from '../../components/Dashboard/CourtTable.jsx';
import BookingTable from '../../components/Dashboard/BookingTable.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import FilterPanel from '../../components/Dashboard/FilterPanel.jsx';
import { useManageCourtsLogic } from '../../hooks/courts/useManageCourtsLogic.js';
import { useFetchBookings } from '../../hooks/bookings/useFetchBookings.js';
import { useFetchAllCourts } from '../../hooks/courts/useFetchAllCourts.js';


function DashboardOverviewPage() {
  const {
    courts,
    loading: loadingCourts,
    error: errorCourts,
    handleOpenModal,
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
  } = useFetchBookings();

  const { courts: allCourts } = useFetchAllCourts();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setCourtsItemsPerPage(5);
    setItemsPerPage(5);
  }, [setCourtsItemsPerPage, setItemsPerPage]);


  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('canchas'); // 'canchas' o 'reservas'

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
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
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">1,245</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>12.3%</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">ÓRDENES</div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">586</div>
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>3.2%</span>
              </div>
            </div>
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {activeTab === 'canchas' ? 'Gestión de Canchas' : 'Gestión de Reservas'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-purple-600/20">
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
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'canchas'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                <MapPin className="w-4 h-4" />
                Canchas
              </button>
              <button
                onClick={() => {
                  setActiveTab('reservas');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'reservas'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
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
                onOpenModal={handleOpenModal}
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
