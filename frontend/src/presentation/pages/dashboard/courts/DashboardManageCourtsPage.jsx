import React from 'react';
import CourtActionsModal from '../../../components/Dashboard/CourtActionsModal.jsx';
import Spinner from '../../../components/common/Spinner.jsx';
import CourtTable from '../../../components/Dashboard/CourtTable.jsx';
import { useManageCourtsLogic } from '../../../hooks/courts/useManageCourtsLogic.js';

function DashboardManageCourtsPage() {
  const {
    courts,
    loading,
    error,
    actionStatus,
    selectedCourt,
    courtToDelete,
    isDeleting,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCourts,
    handleSuspendCourtClick,
    handleReactivateCourtClick,
    handleDeleteRequest,
    handleConfirmDeleteClick,
    handleCancelDelete,
    handleModifyRequest,
    handleOpenModal,
    handleCloseModal,
  } = useManageCourtsLogic();

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Gestión de Canchas
      </h1>

      {actionStatus && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm font-medium ${
            actionStatus.includes('Error')
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}
        >
          {actionStatus}
        </div>
      )}

      {/* Tabla de Canchas */}
      <CourtTable
        courts={courts}
        onOpenModal={handleOpenModal}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalCourts={totalCourts}
      />

      {/* Modal de Detalles / Acciones */}
      {selectedCourt && (
        <CourtActionsModal
          court={selectedCourt}
          onClose={handleCloseModal}
          onDeleteRequest={handleDeleteRequest}
          onModifyRequest={handleModifyRequest}
          onToggleActiveStatus={async (courtId, isActive) => {
            if (isActive) {
              await handleReactivateCourtClick(courtId);
            } else {
              await handleSuspendCourtClick(courtId);
            }
          }}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {courtToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Confirmar Eliminación
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              ¿Está seguro de que desea eliminar la cancha{' '}
              <span className="font-semibold">"{courtToDelete.name}"</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteClick}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardManageCourtsPage;
