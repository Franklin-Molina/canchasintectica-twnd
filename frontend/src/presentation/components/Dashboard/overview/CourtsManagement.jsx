import React, { useEffect, } from 'react';
import CourtTable from '../../Courts/CourtTable';

const CourtsManagement = ({
  courts,
  handleModifyRequest,
  handleDeleteRequest,
  handleSuspendCourtClick,
  handleReactivateCourtClick,
  courtsCurrentPage,
  setCourtsCurrentPage,
  courtsTotalPages,
  courtsItemsPerPage,
  setCourtsItemsPerPage,
  totalCourts,
}) => {

  useEffect(() => {
    setCourtsItemsPerPage(5);
  }, [setCourtsItemsPerPage]);

  return (
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
      currentPage={courtsCurrentPage}
      totalPages={courtsTotalPages}
      setCurrentPage={setCourtsCurrentPage}
      itemsPerPage={courtsItemsPerPage}
      setItemsPerPage={setCourtsItemsPerPage}
      totalCourts={totalCourts}
    />
  );
};

export default CourtsManagement;
