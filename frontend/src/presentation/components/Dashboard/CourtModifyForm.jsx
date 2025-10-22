import React, { useState, useEffect } from 'react';
import useButtonDisable from '../../hooks/general/useButtonDisable.js';

function CourtModifyForm({ court, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    is_active: true,
    characteristics: ''
  });

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name || '',
        price: court.price || '',
        is_active: court.is_active ?? true,
        characteristics: court.characteristics || ''
      });
    }
  }, [court]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [isSubmitting, handleSubmit] = useButtonDisable(async (e) => {
    e.preventDefault();
    await onSave(court.id, formData);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-700 relative">

        {/* Botón de cierre */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Modificar Cancha: <span className="text-blue-600 dark:text-blue-400">{court?.name}</span>
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Precio:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Características */}
          <div>
            <label htmlFor="characteristics" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Características:
            </label>
            <textarea
              id="characteristics"
              name="characteristics"
              value={formData.characteristics}
              onChange={handleChange}
              rows="3"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">
              Activa
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourtModifyForm;
