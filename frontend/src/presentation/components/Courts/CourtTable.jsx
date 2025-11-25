import React from 'react';
import { formatPrice } from '../../utils/formatters.js'; // Importar la función de formato de precio
import Pagination from '../common/Pagination.jsx';

function CourtTable({
  courts,
  onOpenModal,
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
                  <button
                    onClick={() => onOpenModal(court)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Ver más
                  </button>
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
