import React from 'react';
import BulkEditBar from 'components/bulk-edit/BulkEditBar/BulkEditBar';

const BulkEditOptionsBar = ({ selectedPatients = {}, onClose }) => {
  return (
    <BulkEditBar
      numberOfSelectedItems={selectedPatients?.length}
      onClose={onClose}
      patientView
    >
      <span>
        Lorem Ipsum
        {/* here goes func buttons */}
      </span>
    </BulkEditBar>
  );
};

export default BulkEditOptionsBar;
