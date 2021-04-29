import React, { useRef } from 'react';
import PatientList from './PatientList';
import { StyledPopover } from './styled';

const PatientDropdown = ({
  children,
  onChangePatient,
  selectedPatientIdentifier,
  openPopover,
  closePopover,
  isPopoverOpen,
  isMultipleChange,
  isSubtask,
  hasSubtasks,
}) => {
  const popoverReference = useRef(null);

  return (
    <>
      <div onClick={openPopover} ref={popoverReference}>
        {children}
      </div>
      <StyledPopover
        anchorEl={popoverReference?.current}
        open={isPopoverOpen}
        onClose={() => closePopover(false)}
        width="330"
      >
        <PatientList
          onChangePatient={onChangePatient}
          selectedPatientIdentifier={selectedPatientIdentifier}
          isMultipleChange={isMultipleChange}
          closePopover={closePopover}
          isSubtask={isSubtask}
          hasSubtasks={hasSubtasks}
        />
      </StyledPopover>
    </>
  );
};

export default PatientDropdown;
