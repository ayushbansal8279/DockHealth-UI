import * as PatientTasksApi from 'api/patient-tasks-api';
import {
  SET_ACTIVE_TAB,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
} from './action-types';

export const setActiveTab = activeTab => ({
  type: SET_ACTIVE_TAB,
  payload: { activeTab },
});

export const requestPatientTasks = () => ({ type: REQUEST_PATIENT_TASKS });

export const requestPatientTasksSuccess = lists => ({
  type: REQUEST_PATIENT_TASKS_SUCCESS,
  payload: { lists },
});

export const requestPatientTasksFailure = () => ({
  type: REQUEST_PATIENT_TASKS_FAILURE,
});

export const fetchPatientTasks = (patientIdentifier, status) => dispatch => {
  dispatch(requestPatientTasks());
  return PatientTasksApi.fetchPatientTasksByPatientIdentifier(
    patientIdentifier,
    status,
  ).then(lists => {
    if (lists instanceof Error) {
      dispatch(requestPatientTasksFailure());
    } else {
      dispatch(requestPatientTasksSuccess(lists));
    }
  });
};

export default { setActiveTab };
