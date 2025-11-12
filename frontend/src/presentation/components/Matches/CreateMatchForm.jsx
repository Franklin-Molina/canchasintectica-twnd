import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../infrastructure/api/api';
import { toast } from 'react-toastify';
import CustomSelect from '../common/CustomSelect';
import WeeklyAvailabilityCalendar from '../../pages/courts/WeeklyAvailabilityCalendar';
import { format, addDays, startOfWeek, setHours, setMinutes, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const CreateMatchForm = ({ onClose, onMatchCreated, match }) => {
  const isEditing = !!match;
  const [formData, setFormData] = useState({
    court_id: '',
    category_id: '',
    start_time: '',
    end_time: '',
    players_needed: 1,
  });
  const [courts, setCourts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [weeklyAvailability, setWeeklyAvailability] = useState({});
  const [loadingWeeklyAvailability, setLoadingWeeklyAvailability] = useState(false);
  const [weeklyAvailabilityError, setWeeklyAvailabilityError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // { date: 'YYYY-MM-DD', hour: number }
  const [showCalendar, setShowCalendar] = useState(false); // Controla la visibilidad del calendario

  const daysOfWeek = useMemo(() => ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], []);
  const hoursOfDay = useMemo(() => {
    const hours = [];
    for (let i = 6; i <= 22; i++) { // Horario de 6 AM a 10 PM
      const startHour = i;
      const endHour = i + 1;
      const formatHour = (h) => {
        const period = h < 12 ? 'AM' : 'PM';
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}:00 ${period}`;
      };
      hours.push(`${formatHour(startHour)} - ${formatHour(endHour)}`);
    }
    return hours;
  }, []);

  const monday = useMemo(() => startOfWeek(new Date(), { locale: es, weekStartsOn: 1 }), []); // Lunes de la semana actual

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courtsRes = await api.get('/api/courts/');
        const categoriesRes = await api.get('/api/matches/open-matches/categories/');
        setCourts(courtsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        toast.error("No se pudieron cargar los datos para el formulario.");
      }
    };
    fetchData();

    if (isEditing && match) {
      const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString().slice(0, 16);
      };

      setFormData({
        court_id: match.court_id_read,
        category_id: match.category_id_read,
        start_time: formatDateTimeLocal(match.start_time),
        end_time: formatDateTimeLocal(match.end_time),
        players_needed: match.players_needed,
      });
      setSelectedCourtId(match.court_id_read);
      // Si estamos editando, también necesitamos establecer el slot seleccionado si hay una hora de inicio
      if (match.start_time) {
        const startDate = parseISO(match.start_time);
        setSelectedSlot({
          date: format(startDate, 'yyyy-MM-dd'),
          hour: startDate.getHours(),
        });
      }
    }
  }, [isEditing, match]);

  useEffect(() => {
    if (selectedCourtId) {
      const fetchWeeklyAvailability = async () => {
        setLoadingWeeklyAvailability(true);
        setWeeklyAvailabilityError(null);
        try {
          const sunday = addDays(monday, 6); // Calcular el domingo
          const response = await api.get(`/api/courts/${selectedCourtId}/weekly-availability/`, {
            params: {
              start_date: format(monday, 'yyyy-MM-dd'),
              end_date: format(sunday, 'yyyy-MM-dd'),
            },
          });
          setWeeklyAvailability(response.data);
        } catch (error) {
          console.error("Error fetching weekly availability:", error);
          toast.error("No se pudo cargar la disponibilidad semanal de la cancha.");
          setWeeklyAvailabilityError("No se pudo cargar la disponibilidad semanal de la cancha.");
          setWeeklyAvailability({});
        } finally {
          setLoadingWeeklyAvailability(false);
        }
      };
      fetchWeeklyAvailability();
    } else {
      setWeeklyAvailability({});
      setWeeklyAvailabilityError(null);
    }
  }, [selectedCourtId, monday]); // Añadir monday como dependencia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'court_id') {
      setSelectedCourtId(value);
      setSelectedSlot(null); // Reset selected slot when court changes
      setFormData(prev => ({ ...prev, start_time: '', end_time: '' })); // Clear times
      setShowCalendar(true); // Mostrar calendario cuando se selecciona una cancha
    }
  };

  const handleTimeSlotClick = (date, hour) => {
    const newSelectedSlot = { date, hour };
    setSelectedSlot(newSelectedSlot);

    console.log("Slot seleccionado:", newSelectedSlot);
    console.log("Índice para hoursOfDay:", hour - 6);
    console.log("Valor de hoursOfDay en el índice:", hoursOfDay[hour - 6]);

    // Construir las fechas y horas de inicio y fin
    let startTime = setHours(parseISO(date), hour);
    startTime = setMinutes(startTime, 0);
    let endTime = addDays(startTime, 0); // Mismo día
    endTime = setHours(endTime, hour + 1); // Una hora después
    endTime = setMinutes(endTime, 0);

    setFormData(prev => ({
      ...prev,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    }));
    setShowCalendar(false); // Ocultar calendario después de seleccionar una hora
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Datos enviados al backend:", formData); // Añadir console.log para depuración

    const apiCall = isEditing
      ? api.put(`/api/matches/open-matches/${match.id}/`, formData)
      : api.post('/api/matches/open-matches/', formData);

    try {
      await apiCall;
      toast.success(isEditing ? "¡Partido actualizado!" : "¡Partido creado con éxito!");
      onMatchCreated();
      onClose();
    } catch (error) {
      console.error(isEditing ? "Error updating match:" : "Error creating match:", error);
      toast.error(
        error.response?.data?.detail ||
          (isEditing ? "No se pudo actualizar el partido." : "No se pudo crear el partido.")
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isEditing ? 'Editar Partido' : 'Crear Nuevo Partido'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cancha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Cancha
            </label>
            <CustomSelect
              options={courts.map(c => ({ value: c.id, label: c.name }))}
              value={formData.court_id}
              onChange={(value) => handleSelectChange('court_id', value)}
              placeholder="Selecciona una cancha"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Categoría
            </label>
            <CustomSelect
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              value={formData.category_id}
              onChange={(value) => handleSelectChange('category_id', value)}
              placeholder="Selecciona una categoría"
            />
          </div>

          {/* Selección de Hora */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-3">
              Selecciona Fecha y Hora
            </h3>
            {selectedCourtId && !showCalendar && selectedSlot && (
              <div className="bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-400 px-4 py-3 rounded-lg flex justify-between items-center">
                <span>
                  Hora seleccionada: <strong>{format(parseISO(selectedSlot.date), 'dd/MM/yyyy', { locale: es })}</strong> a las <strong>{hoursOfDay[selectedSlot.hour - 6]}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="ml-4 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium"
                >
                  Cambiar
                </button>
              </div>
            )}

            {selectedCourtId && (showCalendar || !selectedSlot) && (
              <div className="max-w-full overflow-x-auto">
                <WeeklyAvailabilityCalendar
                  weeklyAvailability={weeklyAvailability}
                  loadingWeeklyAvailability={loadingWeeklyAvailability}
                  weeklyAvailabilityError={weeklyAvailabilityError}
                  onTimeSlotClick={handleTimeSlotClick}
                  daysOfWeek={daysOfWeek}
                  hoursOfDay={hoursOfDay}
                  monday={monday}
                  selectedSlot={selectedSlot}
                />
                {showCalendar && selectedSlot && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-100 rounded-lg text-sm font-medium"
                    >
                      Cerrar Calendario
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Jugadores */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Jugadores Necesarios (además de ti)
            </label>
            <input
              type="number"
              name="players_needed"
              min="1"
              value={formData.players_needed}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!formData.court_id || !formData.category_id || !formData.start_time || !formData.end_time}
              className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
                !formData.court_id || !formData.category_id || !formData.start_time || !formData.end_time
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isEditing ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchForm;
