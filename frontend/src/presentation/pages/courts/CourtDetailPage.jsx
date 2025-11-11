import React from 'react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Users, Check, DollarSign, Eye, CalendarDays } from 'lucide-react';

import '../../../styles/HomePage.css';
import '../../../styles/dashboard.css';
import '../../../styles/CourtDetailPage.css';

import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import WeeklyAvailabilityCalendar from './WeeklyAvailabilityCalendar.jsx';
import { useCourtDetailLogic } from '../../hooks/courts/useCourtDetailLogic.js';
import { formatPrice } from '../../utils/formatters.js';

function CourtDetailPage() {
  const {
    court,
    loading,
    error,
    selectedImage,
    isBooking,
    bookingError,
    bookingSuccess,
    showLoginModal,
    showConfirmModal,
    bookingDetailsToConfirm,
    weeklyAvailability,
    loadingWeeklyAvailability,
    weeklyAvailabilityError,
    currentWeekStartDate,
    daysOfWeek,
    hoursOfDay,
    fetchCourtDetails,
    handleCellClick,
    confirmBooking,
    cancelConfirmation,
    handleCloseLoginModal,
    handlePreviousWeek,
    handleNextWeek,
    openModal,
    closeModal,
  } = useCourtDetailLogic();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">¡Oops! Algo salió mal</h2>
          <p className="mb-4">Error al cargar detalles de la cancha: {error.message}</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={fetchCourtDetails}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Cancha no encontrada</h2>
          <p>Lo sentimos, no pudimos encontrar la cancha que buscas.</p>
        </div>
      </div>
    );
  }

  const stats = {
    availableSlots: weeklyAvailability ? Object.values(weeklyAvailability).flatMap(day => Object.values(day)).filter(v => v === true).length : 0,
    occupiedSlots: weeklyAvailability ? Object.values(weeklyAvailability).flatMap(day => Object.values(day)).filter(v => v === false).length : 0,
  };
  const totalSlots = stats.availableSlots + stats.occupiedSlots;
  stats.occupancy = totalSlots > 0 ? Math.round((stats.occupiedSlots / totalSlots) * 100) : 0;


  return (
    <div className="min-h-screen pt-20 bg-gray-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-800 dark:text-white p-6">
      <div className="max-w-8xl mx-auto mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shadow-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                {court.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">{court.description || 'Detalles de la cancha y reservas.'}</p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">
            <span className="text-sm font-medium opacity-90">Precio por hora</span>
            <span className="text-2xl font-bold mt-1">${formatPrice(court.price)}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Slots Disponibles</span>
              <Check className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">{stats.availableSlots}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Ocupación</span>
              <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">{stats.occupancy}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Slots Ocupados</span>
              <Users className="w-5 h-5 text-rose-500 dark:text-rose-400" />
            </div>
            <p className="text-3xl font-bold text-rose-500 dark:text-rose-400">{stats.occupiedSlots}</p>
          </div>
        </div>

        {/* Court Info Section */}
        {(court.description || court.characteristics) && (
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
                {court.description && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">Descripción</h3>
                    <p className="text-slate-600 dark:text-slate-300">{court.description}</p>
                </div>
                )}
                {court.characteristics && (
                <div>
                    <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-2">Características</h3>
                    <p className="text-slate-600 dark:text-slate-300">{court.characteristics}</p>
                </div>
                )}
            </div>
        )}

        {/* Galería de imágenes */}
        {court.images && court.images.length > 0 && (
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
            <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-4">Galería</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {court.images.map(image => (
                <div
                  key={image.id}
                  className="relative cursor-pointer group"
                  onClick={() => openModal(image.image)}
                >
                  <img
                    src={image.image}
                    alt={`Imagen de ${court.name}`}
                    className="w-full h-32 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    <h2 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">Calendario de Disponibilidad</h2>
                </div>
                <div className="flex gap-2">
                <button onClick={handlePreviousWeek} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors">
                    &larr; Anterior
                </button>
                <button onClick={handleNextWeek} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors">
                    Siguiente &rarr;
                </button>
                </div>
            </div>
            <div className="text-center mb-4">
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-300 capitalize">{format(currentWeekStartDate, 'MMMM', { locale: es })}</p>
                <p className="text-slate-500 dark:text-slate-400">
                    {format(currentWeekStartDate, 'dd/MM/yyyy')} - {format(addDays(currentWeekStartDate, 6), 'dd/MM/yyyy')}
                </p>
            </div>
            <WeeklyAvailabilityCalendar
                weeklyAvailability={weeklyAvailability}
                loadingWeeklyAvailability={loadingWeeklyAvailability}
                weeklyAvailabilityError={weeklyAvailabilityError}
                onTimeSlotClick={handleCellClick}
                daysOfWeek={daysOfWeek}
                hoursOfDay={hoursOfDay}
                monday={currentWeekStartDate}
            />
        </div>

        {/* Mensajes de estado */}
        {bookingError && (
            <div className="mt-4 bg-rose-500/20 border border-rose-500 text-rose-500 dark:text-rose-400 px-4 py-3 rounded-lg">
            {bookingError}
            </div>
        )}

        {bookingSuccess && (
            <div className="mt-4 bg-emerald-500/20 border border-emerald-500 text-emerald-500 dark:text-emerald-400 px-4 py-3 rounded-lg">
            ¡Reserva creada con éxito!
            </div>
        )}
      </div>

      {/* Modal de imagen expandida */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Imagen expandida" className="max-w-screen-lg max-h-screen-lg rounded-lg" />
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de reserva */}
      {showConfirmModal && bookingDetailsToConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">Confirmar Reserva</h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">¿Estás seguro de que deseas reservar esta cancha?</p>
                    <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Cancha:</span> <span className="font-semibold">{bookingDetailsToConfirm.courtName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Fecha:</span> <span className="font-semibold">{format(bookingDetailsToConfirm.startDateTime, 'dd/MM/yyyy')}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Hora:</span> <span className="font-semibold">{format(bookingDetailsToConfirm.startDateTime, 'h:mm a')} - {format(bookingDetailsToConfirm.endDateTime, 'h:mm a')}</span></div>
                    </div>
                    <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300">Total a Pagar:</span>
                        <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                            ${formatPrice(bookingDetailsToConfirm.price)}
                        </span>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                    <button onClick={cancelConfirmation} className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button onClick={confirmBooking} disabled={isBooking} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg disabled:opacity-50">
                        {isBooking ? 'Procesando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Modal para solicitar inicio de sesión */}
      <Modal show={showLoginModal} onClose={handleCloseLoginModal} title="Acceso Requerido">
        <p>Para reservar una cancha, debes estar registrado e iniciar sesión.</p>
        <button onClick={handleCloseLoginModal} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Ir a Iniciar Sesión
        </button>
      </Modal>
    </div>
  );
}

export default CourtDetailPage;
