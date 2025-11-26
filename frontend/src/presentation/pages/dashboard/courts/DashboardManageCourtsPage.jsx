import React from 'react';
import Spinner from '../../../components/common/Spinner.jsx';
import CourtTable from '../../../components/Courts/CourtTable.jsx';
import { useManageCourtsLogic } from '../../../hooks/courts/useManageCourtsLogic.js';

function DashboardManageCourtsPage() {
  const {
    courts,
    loading,
    error,
    actionStatus,
    currentPage,
    totalPages,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalCourts,
    handleSuspendCourtClick,
    handleReactivateCourtClick,
    handleDeleteRequest,
    handleModifyRequest,
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
        onModify={handleModifyRequest}
        onDelete={handleDeleteRequest}
        onToggleActive={async (courtId, isActive) => {
          if (isActive) {
            await handleReactivateCourtClick(courtId);
          } else {
            await handleSuspendCourtClick(courtId);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalCourts={totalCourts}
      />
    </div>
  );
}

export default DashboardManageCourtsPage;
