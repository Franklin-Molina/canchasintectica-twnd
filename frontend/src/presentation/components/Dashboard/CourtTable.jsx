import React from 'react';
import { formatPrice } from '../../utils/formatters.js'; // Importar la función de formato de precio

function CourtTable({ courts, onOpenModal }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr className="text-gray-700 dark:text-gray-200">
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courts.map((court) => (
            <tr
              key={court.id}
              className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td className="p-3">{court.id}</td>
              <td className="p-3">{court.name}</td>
              <td className="p-3">${formatPrice(court.price)}</td> {/* Usar formatPrice */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    court.is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                  }`}
                >
                  {court.is_active ? 'Activa' : 'Suspendida'}
                </span>
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => onOpenModal(court)}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Ver más
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourtTable;
