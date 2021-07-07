import {
  SET_PATIENT_FETCHING,
  SET_PATIENT,
  SET_ACTIVE_TAB,
  CLEAR_PATIENT_TASKS,
  INITIALIZE_PATIENT,
} from './action-types';

export const setPatientFetching = () => ({
  type: SET_PATIENT_FETCHING,
});

export const setPatient = patient => ({
  type: SET_PATIENT,
  payload: {
    patient,
  },
});

export const setActiveTab = activeTab => ({
  type: SET_ACTIVE_TAB,
  payload: { activeTab },
});

export const initializePatient = patientIdentifier => ({
  type: INITIALIZE_PATIENT,
  payload: {
    patientIdentifier,
  },
});

export const clearPatientTasksState = () => ({
  type: CLEAR_PATIENT_TASKS,
});
