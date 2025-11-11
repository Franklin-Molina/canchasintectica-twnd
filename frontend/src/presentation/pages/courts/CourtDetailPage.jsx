import React from 'react';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Users, Check, DollarSign, Eye, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../../styles/HomePage.css';
import '../../../styles/dashboard.css';
import '../../../styles/CourtDetailPage.css';

import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import CourtHeader from '../../components/courts/CourtHeader';
import StatsCards from '../../components/courts/StatsCards';
import CourtInfoSection from '../../components/courts/CourtInfoSection';
import CourtImageGallery from '../../components/courts/CourtImageGallery';
import CourtAvailabilityCalendar from '../../components/courts/CourtAvailabilityCalendar';
import { useCourtDetailLogic } from '../../hooks/courts/useCourtDetailLogic.js';
import { formatPrice } from '../../utils/formatters.js';

function CourtDetailPage({ openAuthModal }) {
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
    selectedSlot, // Desestructurar selectedSlot
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
        <CourtHeader court={court} />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Court Info Section */}
        <CourtInfoSection court={court} />

        {/* Galería de imágenes */}
        <CourtImageGallery court={court} openModal={openModal} />

        {/* Calendar Section */}
        <CourtAvailabilityCalendar
          weeklyAvailability={weeklyAvailability}
          loadingWeeklyAvailability={loadingWeeklyAvailability}
          weeklyAvailabilityError={weeklyAvailabilityError}
          handleCellClick={handleCellClick}
          daysOfWeek={daysOfWeek}
          hoursOfDay={hoursOfDay}
          currentWeekStartDate={currentWeekStartDate}
          handlePreviousWeek={handlePreviousWeek}
          handleNextWeek={handleNextWeek}
          selectedSlot={selectedSlot}
        />

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
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Acceso Requerido</h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">Para reservar una cancha, debes estar registrado e iniciar sesión.</p>
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <button onClick={openAuthModal} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg">
                        Iniciar Sesión
                    </button>
                      <button  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg">
                       <Link to="/register">
                           Registrarse
                       </Link>
                    </button>
                    
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default CourtDetailPage;
