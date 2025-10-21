import React from 'react';

/**
 * Componente de paginación reutilizable.
 * @param {object} props - Propiedades del componente.
 * @param {number} props.currentPage - La página actual.
 * @param {number} props.totalPages - El número total de páginas.
 * @param {Function} props.onPageChange - Función a llamar cuando se cambia de página.
 * @returns {JSX.Element|null} El componente de paginación o null si no hay páginas.
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-gray-700 dark:text-gray-300">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}

export default Pagination;
