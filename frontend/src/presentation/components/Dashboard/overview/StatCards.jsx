import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';

const StatCard = ({ title, value, percentage, changeType, icon: Icon, loading, error }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-start justify-between mb-4">
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</div>
        <div className={`w-12 h-12 rounded-full ${Icon.color}/10 flex items-center justify-center`}>
          <Icon.component className={`w-6 h-6 text-${Icon.color}`} />
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">Cargando...</div>
        </div>
      ) : error ? (
        <div className="space-y-2">
           <div className="text-sm font-bold text-red-500 dark:text-red-400">Error al cargar</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          <div className={`flex items-center gap-1 text-sm ${changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
            {changeType === 'increase' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{percentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};


const StatCards = ({ userStats, bookingStats, loadingUserStats, errorUserStats, loadingBookingStats, errorBookingStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="INGRESOS TOTALES"
        value="$24,580"
        percentage="8.5"
        changeType="increase"
        icon={{ component: DollarSign, color: "blue-500" }}
      />
      <StatCard
        title="NUEVOS USUARIOS"
        value={userStats?.total_users.toLocaleString() || 'N/A'}
        percentage={userStats?.percentage_change.toFixed(1) || '0.0'}
        changeType={userStats?.percentage_change >= 0 ? 'increase' : 'decrease'}
        icon={{ component: Users, color: "emerald-500" }}
        loading={loadingUserStats}
        error={errorUserStats}
      />
      <StatCard
        title="RESERVAS"
        value={bookingStats?.total_bookings.toLocaleString() || 'N/A'}
        percentage={bookingStats?.percentage_change.toFixed(1) || '0.0'}
        changeType={bookingStats?.percentage_change >= 0 ? 'increase' : 'decrease'}
        icon={{ component: ShoppingBag, color: "amber-500" }}
        loading={loadingBookingStats}
        error={errorBookingStats}
      />
      <StatCard
        title="CRECIMIENTO"
        value="15.8%"
        percentage="5.7"
        changeType="increase"
        icon={{ component: BarChart3, color: "cyan-500" }}
      />
    </div>
  );
};

export default StatCards;
