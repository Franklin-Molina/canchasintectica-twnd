import React from 'react';
import { formatPrice } from '../../utils/formatters.js'; // Importar la función de formato de precio
import Pagination from '../common/Pagination.jsx';
import { Eye, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'; // Importar los iconos
function CourtTable({
  courts,
  onModify,
  onDelete,
  onToggleActive,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage
  ,
  setItemsPerPage,
  totalCourts,
}) {
  const getRowNumber = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const paginatedCourts = courts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <table className="w-full">
        <thead className="bg-slate-100/50 dark:bg-slate-800/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedCourts.map((court, index) => (
              <tr key={court.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">{getRowNumber(index)}</td>
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{court.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">${formatPrice(court.price)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      court.is_active
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {court.is_active ? 'Activa' : 'Suspendida'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onModify(court)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-yellow-500 dark:text-yellow-400 transition-all"
                      title="Modificar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(court)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-red-500 dark:text-red-400 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => onToggleActive(court.id, !court.is_active)}
                      className={`p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg ${
                        court.is_active ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      } transition-all`}
                      title={court.is_active ? 'Desactivar' : 'Activar'}
                    >
                      {court.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={totalCourts}
      />
    </div>
  );
}

export default CourtTable;
