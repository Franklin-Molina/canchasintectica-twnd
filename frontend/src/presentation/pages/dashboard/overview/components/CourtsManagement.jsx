import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Filter, Plus } from 'lucide-react';
import CourtTable from '../../../../components/Courts/CourtTable.jsx';
import FilterPanel from '../../../../components/Dashboard/FilterPanel.jsx';
import { useManageCourtsLogic } from '../../../../hooks/courts/useManageCourtsLogic.js';

const CourtsManagement = () => {
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
  } = useManageCourtsLogic();

  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const navigate = useNavigate();

  const courtFilters = [
    { id: 'name', label: 'Nombre', type: 'text', placeholder: 'Buscar por nombre...', value: courtNameFilter },
    { id: 'status', label: 'Estado', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'active', label: 'Activa' }, { value: 'inactive', label: 'Inactiva' }], value: courtStatusFilter },
  ];

  const handleFilterChange = (filterId, value) => {
    if (filterId === 'name') setCourtNameFilter(value);
    if (filterId === 'status') setCourtStatusFilter(value);
    setCourtsCurrentPage(1);
  };

  const handleCreateCourtClick = () => {
    navigate('/dashboard/canchas/create');
  };

  const activeFilterCount = (courtNameFilter ? 1 : 0) + (courtStatusFilter !== 'all' ? 1 : 0);

  if (loadingCourts) return <div>Cargando canchas...</div>;
  if (errorCourts) return <div>Error al cargar canchas: {errorCourts.message}</div>;

  return (
    <div>
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Canchas</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Administra y controla tus espacios deportivos</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-300 dark:border-slate-700">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button onClick={handleCreateCourtClick} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-emerald-600/20">
              <Plus className="w-4 h-4" />
              Nueva Cancha
            </button>
          </div>
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={courtFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearCourtFilters}
        activeFilterCount={activeFilterCount}
      />

      <div className="overflow-x-visible">
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
      </div>
    </div>
  );
};

export default CourtsManagement;
