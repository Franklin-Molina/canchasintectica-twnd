import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Clock, Check, X } from 'lucide-react';
import { useWeeklyAvailabilityCalendar } from '../../hooks/courts/useWeeklyAvailabilityCalendar.js';
import Spinner from '../../components/common/Spinner.jsx';

function WeeklyAvailabilityCalendar({
  weeklyAvailability,
  loadingWeeklyAvailability,
  weeklyAvailabilityError,
  onTimeSlotClick,
  daysOfWeek,
  hoursOfDay, // This prop is expected to contain strings like "5:00 PM - 6:00 PM"
  monday,
  selectedSlot
}) {
  const { getSlotIconName } = useWeeklyAvailabilityCalendar(weeklyAvailability);
  const [hoveredSlot, setHoveredSlot] = useState(null); // Stores { date: 'YYYY-MM-DD', hour: number }
  const [hoveredTime, setHoveredTime] = useState('');

  const handleTimeSlotClick = (formattedDate, hourNumber, isAvailable) => {
    if (isAvailable && onTimeSlotClick) {
      onTimeSlotClick(formattedDate, hourNumber);
    }
  };

  const handleMouseEnter = (formattedDate, hourNumber, hourRange) => {
    // The user wants the format "5:00 PM - 6:00 PM".
    // The `hourRange` variable from the `hoursOfDay` map should already be in this format.
    // We will use it directly.
    setHoveredTime(hourRange);
    setHoveredSlot({ date: formattedDate, hour: hourNumber });
  };

  const handleMouseLeave = () => {
    setHoveredTime('');
    setHoveredSlot(null);
  };

  if (loadingWeeklyAvailability) {
    return (
      <Spinner />      
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
    <div className="overflow-x-auto relative"> {/* Added relative positioning for absolute time display */}
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
            // The `hourRange` variable is expected to be a string like "5:00 PM - 6:00 PM"
            // We use it directly when hovering.
            const startHour24 = hourIndex + 6; // Assuming hours start from 6 AM
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

                  let cellClassName = 'p-3 border-r border-slate-200 dark:border-slate-700/50 transition-all relative'; // Added relative for absolute positioning of time
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
                      onMouseEnter={() => handleMouseEnter(formattedDate, hourNumber, hourRange)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {hoveredSlot && hoveredSlot.date === formattedDate && hoveredSlot.hour === hourNumber && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-xs font-bold rounded-md z-10">
                          {hoveredTime}
                        </div>
                      )}
                      <div className="flex items-center justify-center h-full z-0"> {/* z-0 to ensure it's behind the absolute div */}
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
