import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, loading, error }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-start justify-between mb-4">
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</div>
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-500" />
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
          {change && (
            <div className={`flex items-center gap-1 text-sm ${changeType === 'increase' ? 'text-emerald-500' : 'text-red-500'}`}>
              {changeType === 'increase' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{change}</span>
            </div>
          )}
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
        change="8.5%"
        changeType="increase"
        icon={DollarSign}
      />
      <StatCard
        title="NUEVOS USUARIOS"
        value={userStats?.total_users.toLocaleString() || 'N/A'}
        change={`${userStats?.percentage_change.toFixed(1) || '0.0'}% desde el mes pasado`}
        changeType={userStats?.percentage_change >= 0 ? 'increase' : 'decrease'}
        icon={Users}
        loading={loadingUserStats}
        error={errorUserStats}
      />
      <StatCard
        title="RESERVAS"
        value={bookingStats?.total_bookings.toLocaleString() || 'N/A'}
        change={`${bookingStats?.percentage_change.toFixed(1) || '0.0'}% desde el mes pasado`}
        changeType={bookingStats?.percentage_change >= 0 ? 'increase' : 'decrease'}
        icon={ShoppingBag}
        loading={loadingBookingStats}
        error={errorBookingStats}
      />
      <StatCard
        title="CRECIMIENTO"
        value="15.8%"
        change="5.7%"
        changeType="increase"
        icon={BarChart3}
      />
    </div>
  );
};

export default StatCards;
