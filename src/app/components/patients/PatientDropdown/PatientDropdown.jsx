import React, { useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from 'modal/actions';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import PatientList from './PatientList';
import { StyledPopover } from './styled';
import { ListPageContext } from '@/app/views/list-details/ListDetailsView';

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
  origin,
}) => {
  const popoverReference = useRef(null);
  const dispatch = useDispatch();
  const { handlePatientPopoverOpen } = useContext(ListPageContext);
  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const quickAddPatientEnabledItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'patient.quickadd.enabled',
    ) || {};
  const quickAddPatientEnabled = quickAddPatientEnabledItem?.value !== 'false';

  useEffect(() => {
    origin === 'LIST' && handlePatientPopoverOpen(isPopoverOpen);
  }, [isPopoverOpen]);

  const unassignPatient = () => {
    if (isMultipleChange || isSubtask || hasSubtasks) {
      dispatch(
        openModal('UnassignPatient', {
          isWorkflowModal: isMultipleChange,
          confirm: () => {
            onChangePatient(null);
            closePopover();
          },
        }),
      );
    } else {
      onChangePatient(null);
      closePopover();
    }
  };

  const handlePatientSelect = (patient) => {
    if (!patient) {
      unassignPatient();
      return;
    }

    if (
      (selectedPatientIdentifier && isMultipleChange) ||
      isSubtask ||
      hasSubtasks
    ) {
      dispatch(
        openModal('AssignPatient', {
          isWorkflowModal: isMultipleChange,
          confirm: () => {
            onChangePatient(patient?.patientIdentifier, patient);
            closePopover();
          },
          patientName: patient?.lastName
            ? `${patient?.lastName}, ${patient?.firstName}`
            : patient?.firstName,
        }),
      );
    } else {
      onChangePatient(patient?.patientIdentifier, patient);
      closePopover();
    }
  };

  return (
    <>
      <div onClick={openPopover} ref={popoverReference}>
        {children}
      </div>
      <StyledPopover
        anchorEl={popoverReference?.current}
        open={isPopoverOpen}
        onClose={() => closePopover(false)}
        width="auto"
      >
        <PatientList
          onSelect={handlePatientSelect}
          selectedPatientIdentifier={selectedPatientIdentifier}
          disableAdding={!quickAddPatientEnabled}
        />
      </StyledPopover>
    </>
  );
};

export default PatientDropdown;
