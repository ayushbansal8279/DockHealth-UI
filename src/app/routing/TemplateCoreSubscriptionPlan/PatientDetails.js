import { clearPatientTasksState } from 'actions/patient-details-actions';
import { fetchPatient, fetchPatientLabels } from 'sagas/patient-details-saga';

export const onEnterPatientDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  const { patientIdentifier } = params;

  dispatch(fetchPatient(patientIdentifier));
  dispatch(fetchPatientLabels());
};

export const onLeavePatientDetailsView = ({ dispatch }) => {
  dispatch(clearPatientTasksState());
};
