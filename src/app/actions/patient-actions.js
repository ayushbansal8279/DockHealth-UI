import {
  REQUEST_PATIENTS,
  GET_LIST_PATIENTS_SUCCESS,
  GET_PATIENT_SUCCESS,
  GET_PATIENTS_SUCCESS,
  ADD_PATIENT_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
  ADD_PATIENT_TO_TASK_SUCCESS,
  GET_EMR_PATIENTS_SUCCESS,
  SELECT_EMR_PATIENT_SUCCESS, DELETE_PATIENT_SUCCESS, HIGHLIGHT_PATIENT,
} from './action-types';
import * as PatientApi from '../api/patient-api';

export const loading = () => ({ type: REQUEST_PATIENTS });

export const patientToState = patient => ({
  type: GET_PATIENT_SUCCESS,
  patient,
});

export const getAllPatientsSuccess = patients => ({
  type: GET_PATIENTS_SUCCESS,
  patients,
});

export const selectEMRPatient = patient => ({
  type: SELECT_EMR_PATIENT_SUCCESS,
  patient,
});

export const highlightPatient = patientId => ({
  type: HIGHLIGHT_PATIENT,
  patientId,
});

export const getAllPatients = () => async (dispatch) => {
  try {
    const patients = await PatientApi.getAllPatients();
    dispatch(getAllPatientsSuccess(patients));
  } catch (error) {
    throw error;
  }
};

export const getPatientsByTaskList = taskListId => async (dispatch) => {
  try {
    const patients = await PatientApi.getPatientsByTaskList(taskListId);
    dispatch({
      type: GET_LIST_PATIENTS_SUCCESS,
      patients,
    });
  } catch (error) {
    throw error;
  }
};

export const getPatientById = patientId => async (dispatch) => {
  try {
    const patient = patientId ? await PatientApi.getPatientById(patientId) : null;
    dispatch({
      type: GET_PATIENT_SUCCESS,
      patient,
    });
  } catch (error) {
    throw error;
  }
};

export const addPatient = newPatient => async (dispatch) => {
  try {
    const patient = await PatientApi.addPatient(newPatient);
    dispatch({
      type: ADD_PATIENT_SUCCESS,
      patient,
    });
  } catch (error) {
    throw error;
  }
};

export const updatePatient = newPatient => async (dispatch) => {
  try {
    const patient = await PatientApi.updatePatient(newPatient);
    dispatch({
      type: UPDATE_PATIENT_SUCCESS,
      patient,
    });
  } catch (error) {
    throw error;
  }
};

export const addPatientToTask = (patientId, taskId) => async (dispatch) => {
  try {
    const patient = await PatientApi.addPatientToTask(patientId, taskId);
    dispatch({
      type: ADD_PATIENT_TO_TASK_SUCCESS,
      patient,
      taskId,
    });
  } catch (error) {
    throw error;
  }
};

export const lookupEMRPatients = searchToken => async (dispatch) => {
  try {
    const patients = await PatientApi.lookupEMRPatients(searchToken);
    dispatch({
      type: GET_EMR_PATIENTS_SUCCESS,
      patients,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePatient = patientId => async (dispatch) => {
  try {
    await PatientApi.deletePatient(patientId);
    dispatch({
      type: DELETE_PATIENT_SUCCESS,
      patientId,
    });
  } catch (error) {
    throw error;
  }
};
