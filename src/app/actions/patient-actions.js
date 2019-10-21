import {
  REQUEST_PATIENTS,
  GET_LIST_PATIENTS_SUCCESS,
  GET_PATIENT_SUCCESS,
  GET_PATIENTS_SUCCESS,
  ADD_PATIENT_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
  ADD_PATIENT_TO_TASK_SUCCESS,
  REQUEST_EMR_PATIENTS,
  CLEAR_EMR_PATIENTS,
  GET_EMR_PATIENTS_SUCCESS,
  SELECT_EMR_PATIENT_SUCCESS,
  HIGHLIGHT_PATIENT,
  BEGIN_PATIENT_CREATION,
  ABORT_PATIENT_CREATION,
  ADD_PATIENT_ERROR,
  ADD_PATIENT_NOTE_ERROR,
  DELETE_PATIENT_NOTE_ERROR,
  UPDATE_PATIENT_NOTE_ERROR,
  ADD_PATIENT_NOTE,
  UPDATE_PATIENT_NOTE,
  DELETE_PATIENT_NOTE,
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

export const getPatientsByTaskList = taskListId => async dispatch => {
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

export const getPatientById = patientId => async dispatch => {
  try {
    const patient = patientId
      ? await PatientApi.getPatientById(patientId)
      : null;
    dispatch({
      type: GET_PATIENT_SUCCESS,
      patient,
    });
  } catch (error) {
    throw error;
  }
};

export const selectEMRPatient = patient => ({
  type: SELECT_EMR_PATIENT_SUCCESS,
  patient,
});

export const highlightPatient = patientId => ({
  type: HIGHLIGHT_PATIENT,
  patientId,
});

export const beginPatientCreation = () => ({
  type: BEGIN_PATIENT_CREATION,
});

export const abortPatientCreation = () => ({
  type: ABORT_PATIENT_CREATION,
});

export const getAllPatients = () => async dispatch => {
  try {
    const patients = await PatientApi.getAllPatients();
    dispatch(getAllPatientsSuccess(patients));
  } catch (error) {
    throw error;
  }
};

export const getMyPatientsAll = () => async dispatch => {
  try {
    const patients = await PatientApi.getMyPatientsAll();
    dispatch(getAllPatientsSuccess(patients));
  } catch (error) {
    throw error;
  }
};

export const getMyPatientsActive = () => async dispatch => {
  try {
    const patients = await PatientApi.getMyPatientsActive();
    dispatch(getAllPatientsSuccess(patients));
  } catch (error) {
    throw error;
  }
};

export const addPatient = newPatient => async dispatch => {
  try {
    const patient = await PatientApi.addPatient(newPatient);
    dispatch({
      type: ADD_PATIENT_SUCCESS,
      patient,
    });
  } catch (error) {
    dispatch({
      type: ADD_PATIENT_ERROR,
      error,
    });
  }
};

export const updatePatient = newPatient => async dispatch => {
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

export const addPatientToTask = (patientId, taskId) => async dispatch => {
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

export const loadingEMRPatients = () => dispatch => {
  dispatch({ type: REQUEST_EMR_PATIENTS });
};

export const clearEMRPatients = () => dispatch => {
  dispatch({ type: CLEAR_EMR_PATIENTS });
};

export const lookupEMRPatients = searchToken => async dispatch => {
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

export const deletePatient = patientId => async () => {
  try {
    await PatientApi.deletePatient(patientId);
  } catch (error) {
    throw error;
  }
};

export const addPatientNote = (patientId, description) => async dispatch => {
  try {
    const note = await PatientApi.createPatientNote(patientId, { description });
    dispatch({
      type: ADD_PATIENT_NOTE,
      patientId,
      note,
    });
  } catch (e) {
    // toggleAlert('Error adding note. Please try again.', 'error');
    dispatch({
      type: ADD_PATIENT_NOTE_ERROR,
      patientId,
    });
    throw e;
  }
};

export const editPatientNote = (
  patientId,
  note,
  description,
) => async dispatch => {
  try {
    const updatedNote = await PatientApi.updatePatientNote({
      ...note,
      description,
    });
    dispatch({
      type: UPDATE_PATIENT_NOTE,
      patientId,
      note: updatedNote,
    });
  } catch (e) {
    // toggleAlert('Error updating note. Please try again.', 'error');
    dispatch({
      type: UPDATE_PATIENT_NOTE_ERROR,
    });
    throw e;
  }
};

export const deletePatientNote = (patientId, note) => async dispatch => {
  try {
    await PatientApi.deletePatientNote(note.patientNoteId);
    dispatch({
      type: DELETE_PATIENT_NOTE,
      patientId,
      note,
    });
  } catch (e) {
    // toggleAlert('Error in deleting note. Please try again.', 'error');
    dispatch({
      type: DELETE_PATIENT_NOTE_ERROR,
    });
    throw e;
  }
};
