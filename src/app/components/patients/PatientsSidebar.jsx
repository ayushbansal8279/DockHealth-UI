import { Close } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  highlightPatient,
  abortPatientCreation,
} from 'actions/patient-actions';
import PatientEdit from './PatientEdit';
import {
  PatientsSidebarCloseButton,
  PatientsSidebarContainer,
  PatientsSidebarHeader,
  PatientsSidebarName,
} from './PatientsSidebar.Styled';

const PatientsSidebar = ({ patient }) => {
  const { mrn, firstName, lastName } = patient ?? {};

  const dispatch = useDispatch();
  const deselectPatient = useCallback(() => {
    dispatch(highlightPatient(null));
    dispatch(abortPatientCreation());
  }, [dispatch]);

  const patientHeaderLabel = patient
    ? `${firstName || ''} ${lastName || ''} ${mrn || ''}`.trim()
    : 'Add a patient';

  return (
    <PatientsSidebarContainer>
      <PatientsSidebarHeader>
        <PatientsSidebarName variant="h4" weight="500">
          {patientHeaderLabel}
        </PatientsSidebarName>
        <PatientsSidebarCloseButton size="small" onClick={deselectPatient}>
          <Close />
        </PatientsSidebarCloseButton>
      </PatientsSidebarHeader>
      <div>
        <PatientEdit patient={patient} compact onCancel={deselectPatient} />
      </div>
    </PatientsSidebarContainer>
  );
};

export default PatientsSidebar;
