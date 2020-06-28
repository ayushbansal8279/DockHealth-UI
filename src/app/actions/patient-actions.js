/* eslint-disable unicorn/consistent-function-scoping */
import * as PatientApi from 'api/patient-api';
import {
  REQUEST_PATIENTS,
  GET_LIST_PATIENTS_SUCCESS,
  GET_PATIENT_SUCCESS,
  GET_PATIENTS_SUCCESS,
  ADD_PATIENT_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
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

export const loading = () => ({ type: REQUEST_PATIENTS });

export const patientToState = patient => ({
  type: GET_PATIENT_SUCCESS,
  patient,
});

export const getAllPatientsSuccess = patients => ({
  type: GET_PATIENTS_SUCCESS,
  patients,
});

export const getPatientsByTaskList = taskListIdentifier => async dispatch => {
  const patients = await PatientApi.getPatientsByTaskList(taskListIdentifier);
  dispatch({
    type: GET_LIST_PATIENTS_SUCCESS,
    patients,
  });
};

export const getPatientById = patientIdentifier => async dispatch => {
  const patient = patientIdentifier
    ? await PatientApi.getPatientById(patientIdentifier)
    : null;
  dispatch({
    type: GET_PATIENT_SUCCESS,
    patient,
  });
};

export const selectEMRPatient = patient => ({
  type: SELECT_EMR_PATIENT_SUCCESS,
  patient,
});

export const highlightPatient = patientIdentifier => ({
  type: HIGHLIGHT_PATIENT,
  patientIdentifier,
});

export const beginPatientCreation = () => ({
  type: BEGIN_PATIENT_CREATION,
});

export const abortPatientCreation = () => ({
  type: ABORT_PATIENT_CREATION,
});

export const getAllPatients = () => async dispatch => {
  const patients = await PatientApi.getAllPatients();
  dispatch(getAllPatientsSuccess(patients));
  return patients;
};

export const getMyPatientsAll = () => async dispatch => {
  const patients = await PatientApi.getMyPatientsAll();
  dispatch(getAllPatientsSuccess(patients));
};

export const getMyPatientsActive = () => async dispatch => {
  const patients = await PatientApi.getMyPatientsActive();
  dispatch(getAllPatientsSuccess(patients));
};

export const addPatient = newPatient => async dispatch => {
  try {
    const patient = await PatientApi.addPatient(newPatient);
    dispatch({
      type: ADD_PATIENT_SUCCESS,
      patient,
    });
    return patient;
  } catch (error) {
    dispatch({
      type: ADD_PATIENT_ERROR,
      error,
    });
    throw error;
  }
};

export const updatePatient = newPatient => async dispatch => {
  const patient = await PatientApi.updatePatient(newPatient);
  dispatch({
    type: UPDATE_PATIENT_SUCCESS,
    patient,
  });
};

export const loadingEMRPatients = () => dispatch => {
  dispatch({ type: REQUEST_EMR_PATIENTS });
};

export const clearEMRPatients = () => dispatch => {
  dispatch({ type: CLEAR_EMR_PATIENTS });
};

export const lookupEMRPatients = searchToken => async dispatch => {
  const patients = await PatientApi.lookupEMRPatients(searchToken);
  dispatch({
    type: GET_EMR_PATIENTS_SUCCESS,
    patients,
  });
};

export const deletePatient = patientIdentifier => async () => {
  await PatientApi.deletePatient(patientIdentifier);
};

export const addPatientNote = (
  patientIdentifier,
  description,
) => async dispatch => {
  try {
    const note = await PatientApi.createPatientNote(patientIdentifier, {
      description,
    });
    dispatch({
      type: ADD_PATIENT_NOTE,
      patientIdentifier,
      note,
    });
    return note;
  } catch (error) {
    dispatch({
      type: ADD_PATIENT_NOTE_ERROR,
      patientIdentifier,
    });
    throw error;
  }
};

export const editPatientNote = (
  patientIdentifier,
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
      patientIdentifier,
      note: updatedNote,
    });
    return updatedNote;
  } catch (error) {
    dispatch({
      type: UPDATE_PATIENT_NOTE_ERROR,
    });
    throw error;
  }
};

export const deletePatientNote = (
  patientIdentifier,
  note,
) => async dispatch => {
  try {
    await PatientApi.deletePatientNote(note.patientNoteIdentifier);
    dispatch({
      type: DELETE_PATIENT_NOTE,
      patientIdentifier,
      note,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PATIENT_NOTE_ERROR,
    });
    throw error;
  }
};
