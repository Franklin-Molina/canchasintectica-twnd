import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, MinusCircle } from 'lucide-react';

const ScheduleGrid = () => {
  // Datos de ejemplo - ajusta según tu estructura real
  const [scheduleData] = useState({
    timeSlots: [
      '6:00 AM - 7:00 AM',
      '7:00 AM - 8:00 AM',
      '8:00 AM - 9:00 AM',
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM',
      '5:00 PM - 6:00 PM',
      '6:00 PM - 7:00 PM',
      '7:00 PM - 8:00 PM',
      '8:00 PM - 9:00 PM'
    ],
    days: [
      { name: 'Lunes', date: '01/12', slots: ['expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired'] },
      { name: 'Martes', date: '02/12', slots: ['expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'expired', 'available', 'available', 'available', 'available', 'available', 'available', 'available'] },
      { name: 'Miércoles', date: '03/12', slots: Array(15).fill('available') },
      { name: 'Jueves', date: '04/12', slots: Array(15).fill('available') },
      { name: 'Viernes', date: '05/12', slots: ['available', 'available', 'available', 'available', 'available', 'available', 'occupied', 'available', 'available', 'available', 'available', 'available', 'available', 'available', 'available'] },
      { name: 'Sábado', date: '06/12', slots: Array(15).fill('available') },
      { name: 'Domingo', date: '07/12', slots: Array(15).fill('available') }
    ]
  });

  const [viewMode, setViewMode] = useState('compact'); // 'compact' o 'detailed'

  const getSlotStyle = (status) => {
    switch(status) {
      case 'available':
        return 'bg-teal-500/20 hover:bg-teal-500/30 border-teal-500/30';
      case 'occupied':
        return 'bg-red-500/20 border-red-500/40';
      case 'expired':
        return 'bg-gray-500/10 border-gray-600/20 opacity-40';
      case 'selected':
        return 'bg-blue-500/30 border-blue-500/50';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSlotIcon = (status) => {
    if (status === 'available') {
      return <CheckCircle className="w-4 h-4 text-teal-400" />;
    } else if (status === 'occupied') {
      return <XCircle className="w-4 h-4 text-red-400" />;
    } else if (status === 'expired') {
      return <MinusCircle className="w-4 h-4 text-gray-500" />;
    }
    return null;
  };

  // Estadísticas
  const totalSlots = scheduleData.days.reduce((acc, day) => acc + day.slots.length, 0);
  const occupiedSlots = scheduleData.days.reduce((acc, day) => 
    acc + day.slots.filter(s => s === 'occupied').length, 0
  );
  const expiredSlots = scheduleData.days.reduce((acc, day) => 
    acc + day.slots.filter(s => s === 'expired').length, 0
  );
  const availableSlots = totalSlots - occupiedSlots - expiredSlots;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-teal-400" />
            <h1 className="text-3xl font-bold text-white">Horarios Disponibles</h1>
          </div>
          
          {/* Stats & Controls */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              {/* Estadísticas */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                  <span className="text-sm text-slate-300">
                    Disponibles: <span className="font-bold text-teal-400">{availableSlots}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-300">
                    Ocupados: <span className="font-bold text-red-400">{occupiedSlots}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-slate-300">
                    Expirados: <span className="font-bold text-gray-400">{expiredSlots}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">
                    Total: <span className="font-bold text-white">{totalSlots}</span>
                  </span>
                </div>
              </div>

              {/* Toggle View Mode */}
              <div className="flex gap-2 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'compact' 
                      ? 'bg-teal-500 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compacto
                </button>
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'detailed' 
                      ? 'bg-teal-500 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Detallado
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700">
                  <th className="sticky left-0 z-20 bg-slate-800 px-4 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-300">Horario</span>
                    </div>
                  </th>
                  {scheduleData.days.map((day, idx) => (
                    <th key={idx} className="px-3 py-4 text-center min-w-[100px]">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{day.name}</span>
                        <span className="text-xs text-slate-400">{day.date}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {scheduleData.timeSlots.map((timeSlot, timeIdx) => (
                  <tr 
                    key={timeIdx}
                    className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  >
                    {/* Time Column */}
                    <td className="sticky left-0 z-10 bg-slate-800/95 px-4 py-3 border-r border-slate-700/50">
                      <span className="text-xs md:text-sm font-medium text-slate-300 whitespace-nowrap">
                        {timeSlot}
                      </span>
                    </td>

                    {/* Day Slots */}
                    {scheduleData.days.map((day, dayIdx) => {
                      const slotStatus = day.slots[timeIdx];
                      const isOccupied = slotStatus === 'occupied';
                      const isExpired = slotStatus === 'expired';
                      const isClickable = !isOccupied && !isExpired;
                      
                      return (
                        <td key={dayIdx} className="px-2 py-2">
                          {viewMode === 'compact' ? (
                            // Vista Compacta - Solo indicador visual
                            <div 
                              className={`w-full h-10 rounded-lg border-2 transition-all ${
                                getSlotStyle(slotStatus)
                              } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                              title={
                                isExpired ? 'Horario pasado' : 
                                isOccupied ? 'Ocupado' : 
                                'Disponible'
                              }
                            >
                              <div className="w-full h-full flex items-center justify-center">
                                {getSlotIcon(slotStatus)}
                              </div>
                            </div>
                          ) : (
                            // Vista Detallada - Con texto
                            <div 
                              className={`w-full px-3 py-2 rounded-lg border-2 transition-all ${
                                getSlotStyle(slotStatus)
                              } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                {getSlotIcon(slotStatus)}
                                <span className={`text-xs font-medium ${
                                  isExpired ? 'text-gray-400' :
                                  isOccupied ? 'text-red-300' : 
                                  'text-teal-300'
                                }`}>
                                  {isExpired ? 'Pasado' : isOccupied ? 'Ocupado' : 'Libre'}
                                </span>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Leyenda:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border-2 border-teal-500/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-teal-400" />
              </div>
              <span className="text-sm text-slate-300">Horario disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-sm text-slate-300">Horario ocupado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-500/10 border-2 border-gray-600/20 opacity-40 flex items-center justify-center">
                <MinusCircle className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-sm text-slate-300">Horario pasado (expirado)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleGrid;