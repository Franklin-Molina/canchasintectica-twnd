import React, { useState, useCallback } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import Spinner from '../../../components/common/Spinner.jsx';
import { useAutoRefresh } from '../../../hooks/bookings/useAutoRefresh.js';
import useUserStats from '../../../hooks/users/useUserStats.js';
import useBookingStats from '../../../hooks/bookings/useBookingStats.js';
import { useFetchBookings } from '../../../hooks/bookings/useFetchBookings.js';
import StatCards from './components/StatCards.jsx';
import CourtsManagement from './components/CourtsManagement.jsx';
import BookingsManagement from './components/BookingsManagement.jsx';

function DashboardOverviewPage() {
  const { stats: userStats, loading: loadingUserStats, error: errorUserStats } = useUserStats();
  const { stats: bookingStats, loading: loadingBookingStats, error: errorBookingStats } = useBookingStats();
  const { fetchAllBookings, bookings } = useFetchBookings({ onlyActive: true });
  const [activeTab, setActiveTab] = useState('canchas');

  const { timeSinceLastUpdate } = useAutoRefresh(fetchAllBookings, 10000, bookings);

  const renderContent = () => {
    switch (activeTab) {
      case 'canchas':
        return <CourtsManagement />;
      case 'reservas':
        return <BookingsManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
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
            <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('canchas')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'canchas'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                <MapPin className="w-4 h-4" />
                Canchas
              </button>
              <button
                onClick={() => setActiveTab('reservas')}
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default DashboardOverviewPage;
