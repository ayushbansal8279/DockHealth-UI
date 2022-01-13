import {
  clearPatientTasksState,
  initializePatientState,
} from 'actions/patient-details-actions';

export const onEnterPatientDetailsView = ({ match, dispatch }) => {
  const { params } = match;
  const { patientIdentifier } = params;

  dispatch(initializePatientState(patientIdentifier));
};

export const onLeavePatientDetailsView = ({ dispatch }) => {
  dispatch(clearPatientTasksState());
};
