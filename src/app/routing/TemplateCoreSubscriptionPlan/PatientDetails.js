import { clearPatientTasksState } from 'actions/patient-details-actions';
import { fetchPatient } from 'sagas/patient-details-saga';

export const onEnterPatientDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  const { patientIdentifier } = params;

  dispatch(fetchPatient(patientIdentifier));
};

export const onLeavePatientDetailsView = ({ dispatch }) => {
  dispatch(clearPatientTasksState());
};
