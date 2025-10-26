import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, BarChart3, Calendar, MapPin, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ManagementSystem() {
  const [activeTab, setActiveTab] = useState('canchas'); // 'canchas' o 'reservas'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Datos de ejemplo para canchas
  const canchas = [
    { id: 1, nombre: 'BLO3', precio: 90000, estado: 'Activa' },
    { id: 2, nombre: 'c1', precio: 34444, estado: 'Activa' },
    { id: 3, nombre: 'c3', precio: 67555, estado: 'Activa' },
    { id: 4, nombre: 'c4', precio: 96555, estado: 'Activa' },
    { id: 5, nombre: 'mini tejo', precio: 85, estado: 'Activa' },
    { id: 6, nombre: 'Cancha A', precio: 45000, estado: 'Inactiva' },
    { id: 7, nombre: 'Cancha B', precio: 55000, estado: 'Activa' },
  ];

  // Datos de ejemplo para reservas
  const reservas = [
    { id: 1, cliente: 'Juan Pérez', cancha: 'BLO3', fecha: '2025-10-25', hora: '14:00', duracion: '2h', estado: 'Confirmada', total: 90000 },
    { id: 2, cliente: 'María García', cancha: 'c1', fecha: '2025-10-25', hora: '16:00', duracion: '1h', estado: 'Confirmada', total: 34444 },
    { id: 3, cliente: 'Carlos López', cancha: 'c3', fecha: '2025-10-26', hora: '10:00', duracion: '3h', estado: 'Pendiente', total: 202665 },
    { id: 4, cliente: 'Ana Martínez', cancha: 'c4', fecha: '2025-10-26', hora: '18:00', duracion: '1h', estado: 'Confirmada', total: 96555 },
    { id: 5, cliente: 'Luis Rodríguez', cancha: 'mini tejo', fecha: '2025-10-27', hora: '12:00', duracion: '2h', estado: 'Cancelada', total: 170 },
    { id: 6, cliente: 'Sofia Torres', cancha: 'BLO3', fecha: '2025-10-27', hora: '15:00', duracion: '1h', estado: 'Confirmada', total: 90000 },
    { id: 7, cliente: 'Pedro Sánchez', cancha: 'c1', fecha: '2025-10-28', hora: '09:00', duracion: '2h', estado: 'Pendiente', total: 68888 },
  ];

  const totalPages = Math.ceil((activeTab === 'canchas' ? canchas.length : reservas.length) / itemsPerPage);
  const currentData = activeTab === 'canchas' ? canchas : reservas;
  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getEstadoColor = (estado) => {
    const colors = {
      'Activa': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Inactiva': 'bg-slate-100 text-slate-700 border-slate-200',
      'Confirmada': 'bg-blue-100 text-blue-700 border-blue-200',
      'Pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
      'Cancelada': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-400 text-sm font-medium">INGRESOS TOTALES</div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">$24,580</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>8.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-400 text-sm font-medium">NUEVOS USUARIOS</div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">1,245</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>12.3%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-400 text-sm font-medium">ÓRDENES</div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">586</div>
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>3.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="text-slate-400 text-sm font-medium">CRECIMIENTO</div>
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">15.8%</div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>5.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          {/* Header with Tabs */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {activeTab === 'canchas' ? 'Gestión de Canchas' : 'Gestión de Reservas'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {activeTab === 'canchas' 
                    ? 'Administra y controla tus espacios deportivos' 
                    : 'Administra y controla las reservas de tus canchas'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-700">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-purple-600/20">
                  <Plus className="w-4 h-4" />
                  {activeTab === 'canchas' ? 'Nueva Cancha' : 'Nueva Reserva'}
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 mt-6 bg-slate-800/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab('canchas');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'canchas'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200'
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'reservas'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Reservas
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  {activeTab === 'canchas' ? (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Cancha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activeTab === 'canchas' ? (
                  paginatedData.map((cancha) => (
                    <tr key={cancha.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">{cancha.id}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{cancha.nombre}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">${cancha.precio.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(cancha.estado)}`}>
                          {cancha.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                          Ver más
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  paginatedData.map((reserva) => (
                    <tr key={reserva.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">{reserva.id}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{reserva.cliente}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{reserva.cancha}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{reserva.fecha}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{reserva.hora} ({reserva.duracion})</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-semibold text-right">${reserva.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                          Ver más
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-400">
                  Mostrando <span className="font-semibold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                  <span className="font-semibold text-white">{Math.min(currentPage * itemsPerPage, currentData.length)}</span> de{' '}
                  <span className="font-semibold text-white">{currentData.length}</span> registros
                </p>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Mostrar:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-700"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-300" />
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === idx + 1
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-700"
                >
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}