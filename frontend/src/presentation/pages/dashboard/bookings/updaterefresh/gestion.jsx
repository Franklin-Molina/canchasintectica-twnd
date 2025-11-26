import React, { useState, useEffect } from 'react';
import { Trash2, Bell } from 'lucide-react';

const ReservasApp = () => {
  const [reservas, setReservas] = useState([
    { id: 1, cancha: 'c4', usuario: 'franklin Molina', inicio: '2025-11-26T20:00:00', fin: '2025-11-26T21:00:00', fechaReserva: '2025-11-26T08:34:24', estado: 'PENDING', pago: '33' },
    { id: 2, cancha: 'BLO3', usuario: 'Betta Beteaok8', inicio: '2025-11-26T14:00:00', fin: '2025-11-26T15:00:00', fechaReserva: '2025-11-26T08:34:24', estado: 'PENDING', pago: '34' },
    { id: 3, cancha: 'BLO3', usuario: 'Betta Beteaok8', inicio: '2025-11-26T10:00:00', fin: '2025-11-26T11:00:00', fechaReserva: '2025-11-26T08:34:24', estado: 'PENDING', pago: '43' },
    { id: 4, cancha: 'BLO3', usuario: 'franklin Molina', inicio: '2025-11-29T10:00:00', fin: '2025-11-29T11:00:00', fechaReserva: '2025-11-26T08:34:24', estado: 'confirmed', pago: '' },
    { id: 5, cancha: 'BLO3', usuario: 'FRr TRY', inicio: '2025-11-27T07:00:00', fin: '2025-11-27T08:00:00', fechaReserva: '2025-11-26T08:34:24', estado: 'PENDING', pago: '45' },
  ]);

  const [ultimaActualizacion, setUltimaActualizacion] = useState(0);
  const [notificacion, setNotificacion] = useState(null);
  const [nuevaReservaId, setNuevaReservaId] = useState(null);

  // Simular WebSocket - En producción usarías socket.io
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula que llega una nueva reserva del servidor
      const probabilidad = Math.random();
      if (probabilidad > 0.7) { // 30% de probabilidad
        agregarNuevaReserva();
      }
    }, 8000); // Cada 8 segundos

    return () => clearInterval(interval);
  }, [reservas]);

  // Actualizar timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      setUltimaActualizacion(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const agregarNuevaReserva = () => {
    const usuarios = ['Carlos Ruiz', 'Ana García', 'Pedro López', 'María Silva'];
    const canchas = ['c4', 'BLO3', 'mini tejo'];
    
    const nuevaReserva = {
      id: reservas.length + 1,
      cancha: canchas[Math.floor(Math.random() * canchas.length)],
      usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
      inicio: `2025-11-2${Math.floor(Math.random() * 3) + 7}T${10 + Math.floor(Math.random() * 8)}:00:00`,
      fin: `2025-11-2${Math.floor(Math.random() * 3) + 7}T${11 + Math.floor(Math.random() * 8)}:00:00`,
      fechaReserva: new Date().toISOString(),
      estado: 'PENDING',
      pago: String(50 + reservas.length)
    };

    setReservas(prev => [...prev, nuevaReserva]);
    setNuevaReservaId(nuevaReserva.id);
    setUltimaActualizacion(0);
    
    mostrarNotificacion(`${nuevaReserva.usuario} reservó ${nuevaReserva.cancha}`);

    // Quitar el highlight después de 3 segundos
    setTimeout(() => setNuevaReservaId(null), 3000);
  };

  const mostrarNotificacion = (texto) => {
    setNotificacion(texto);
    setTimeout(() => setNotificacion(null), 4000);
  };

  const eliminarReserva = (id) => {
    setReservas(prev => prev.filter(r => r.id !== id));
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const formatearHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  };

  const formatearFechaHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${año}, ${horas}:${minutos}:${segundos}`;
  };

  const formatearTiempo = (segundos) => {
    if (segundos < 60) return `hace ${segundos}s`;
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `hace ${minutos}min`;
    const horas = Math.floor(minutos / 60);
    return `hace ${horas}h`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-8 py-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Administración</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-semibold">
              A
            </div>
            <div>
              <div className="font-semibold text-sm">admin</div>
              <div className="text-xs text-gray-400">Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Gestión de Reservas</h2>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/30 px-5 py-3 rounded-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div>
              <div className="text-green-500 font-medium text-sm">Sistema Activo</div>
              <div className="text-xs text-gray-400">
                Última actualización: {formatearTiempo(ultimaActualizacion)}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="px-6 py-5 bg-gray-800/50 border-b border-gray-800">
            <h3 className="text-lg font-semibold">Reservas Activas</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cancha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Horario</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha Reserva</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Pago</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr 
                    key={reserva.id}
                    className={`border-b border-gray-800/50 hover:bg-green-500/5 transition-all duration-300 ${
                      nuevaReservaId === reserva.id ? 'bg-green-500/20 animate-pulse' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">{reserva.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{reserva.cancha}</td>
                    <td className="px-6 py-4 text-sm">{reserva.usuario}</td>
                    <td className="px-6 py-4 text-sm">{formatearFecha(reserva.inicio)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {formatearHora(reserva.inicio)} - {formatearHora(reserva.fin)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatearFechaHora(reserva.fechaReserva)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        reserva.estado === 'PENDING' 
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                          : 'bg-green-500/10 text-green-500 border border-green-500/30'
                      }`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{reserva.pago}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => eliminarReserva(reserva.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Notification */}
      {notificacion && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gray-900 border border-green-500/30 rounded-xl px-6 py-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Bell className="text-green-500" size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Nueva Reserva</h4>
              <p className="text-xs text-gray-400">{notificacion}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReservasApp;