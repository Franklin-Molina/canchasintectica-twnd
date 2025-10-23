import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

function ProfessionalFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Gestión de Usuarios
        </h1>

        {/* 🔍 Controles de Filtro y Búsqueda - Diseño Profesional */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all">
          
          {/* Barra principal de búsqueda y acciones */}
          <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Campo de búsqueda principal */}
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, usuario o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all"
              />
            </div>

            {/* Botón de filtros avanzados */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                isFilterOpen
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Panel de filtros expandible */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isFilterOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                
                {/* Filtro de estado */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                    Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="suspended">Suspendidos</option>
                  </select>
                </div>

          

                {/* Filtro adicional: Fecha de registro */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 ml-1">
                    Fecha de registro
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent cursor-pointer transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                  >
                    <option value="all">Todas las fechas</option>
                    <option value="today">Hoy</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mes</option>
                    <option value="year">Último año</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción en filtros */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                  Limpiar filtros
                </button>
                <div className="flex-grow"></div>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {statusFilter !== 'all' ? '1 filtro activo' : 'Sin filtros'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa de resultados */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">Búsqueda: <span className="font-medium text-gray-900 dark:text-gray-100">{searchTerm || 'Todos'}</span></p>
            <p className="text-sm mt-1">Estado: <span className="font-medium text-gray-900 dark:text-gray-100">
              {statusFilter === 'all' ? 'Todos' : statusFilter === 'active' ? 'Activos' : 'Suspendidos'}
            </span></p>
            <p className="text-xs mt-4 text-gray-400">Contenido de la tabla o lista aquí...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalFilters;