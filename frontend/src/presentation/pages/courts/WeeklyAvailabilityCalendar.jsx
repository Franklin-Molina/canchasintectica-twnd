import React from 'react';
import { format, addDays } from 'date-fns';
import { Clock, Check, X } from 'lucide-react';
import { useWeeklyAvailabilityCalendar } from '../../hooks/courts/useWeeklyAvailabilityCalendar.js';
import '../../../styles/WeeklyAvailabilityCalendar.css';

function WeeklyAvailabilityCalendar({
  weeklyAvailability,
  loadingWeeklyAvailability,
  weeklyAvailabilityError,
  onTimeSlotClick,
  daysOfWeek,
  hoursOfDay,
  monday,
  selectedSlot
}) {
  const { getSlotIconName } = useWeeklyAvailabilityCalendar(weeklyAvailability);

  const handleTimeSlotClick = (formattedDate, hourNumber, isAvailable) => {
    if (isAvailable && onTimeSlotClick) {
      onTimeSlotClick(formattedDate, hourNumber);
    }
  };

  if (loadingWeeklyAvailability) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (weeklyAvailabilityError) {
    return (
      <div className="bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-lg text-center">
        <p>{weeklyAvailabilityError}</p>
      </div>
    );
  }

  if (!weeklyAvailability || Object.keys(weeklyAvailability).length === 0) {
    return (
      <div className="bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 px-4 py-3 rounded-lg text-center">
        <p>No hay disponibilidad cargada para esta semana.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="grid grid-cols-8 bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
          <div className="p-4 font-semibold border-r border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-white">
            <Clock className="w-5 h-5" /> Horario
          </div>
          {daysOfWeek.map((day, index) => {
            const currentDay = addDays(monday, index);
            return (
              <div key={day} className="p-4 text-center border-r border-slate-200 dark:border-slate-700">
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{day}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{format(currentDay, 'dd/MM')}</div>
              </div>
            );
          })}
        </div>

        {/* Time Slots Grid */}
        <div>
          {hoursOfDay.map((hourRange, hourIndex) => {
            const startHour24 = hourIndex + 6;
            return (
              <div key={hourRange} className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700/50">
                <div className="p-3 text-sm text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700/50 flex items-center">
                  {hourRange}
                </div>
                {daysOfWeek.map((day, dayIndex) => {
                  const currentDay = addDays(monday, dayIndex);
                  const formattedDate = format(currentDay, 'yyyy-MM-dd');
                  const hourNumber = startHour24;

                  const dailyAvailability = weeklyAvailability[formattedDate];
                  const isAvailable = dailyAvailability && dailyAvailability[hourNumber] === true;
                  const isOccupied = dailyAvailability && dailyAvailability[hourNumber] === false;

                  let cellClassName = 'p-3 border-r border-slate-200 dark:border-slate-700/50 transition-all';
                  if (isAvailable) {
                    cellClassName += ' bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 cursor-pointer';
                  } else if (isOccupied) {
                    cellClassName += ' bg-rose-100 dark:bg-rose-500/20';
                  } else {
                    cellClassName += ' bg-slate-50 dark:bg-slate-800/20';
                  }

                  const isSelected = selectedSlot?.date === formattedDate && selectedSlot?.hour === hourNumber;
                  if (isSelected) {
                    cellClassName += ' ring-2 ring-emerald-500 dark:ring-emerald-400';
                  }

                  return (
                    <div
                      key={`${day}-${hourRange}`}
                      className={cellClassName}
                      onClick={() => handleTimeSlotClick(formattedDate, hourNumber, isAvailable)}
                    >
                      <div className="flex items-center justify-center h-full">
                        {isAvailable && <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 opacity-50" />}
                        {isOccupied && <X className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeeklyAvailabilityCalendar;
