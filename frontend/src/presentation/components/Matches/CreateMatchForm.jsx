import React, { useState, useEffect } from 'react';
import api from '../../../infrastructure/api/api';
import { toast } from 'react-toastify';
import CustomSelect from '../common/CustomSelect';

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
    }
  }, [isEditing, match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

          {/* Hora inicio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Hora de Inicio
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Hora fin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
              Hora de Fin
            </label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
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
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
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
