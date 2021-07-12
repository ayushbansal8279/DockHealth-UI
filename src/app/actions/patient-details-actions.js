import {
  SET_PATIENT_FETCHING,
  SET_PATIENT,
  SET_PATIENT_LABELS_FETCHING,
  SET_PATIENT_LABELS,
  SET_PATIENT_ATTACHMENTS_FETCHING,
  SET_PATIENT_ATTACHMENTS,
  SET_COMPLETE_TASKS_VISIBILITY,
  CLEAR_PATIENT_TASKS,
  INITIALIZE_PATIENT,
  UPDATE_PATIENT_NOTE,
  UPDATE_PATIENT_DETAILS,
  ARCHIEVE_PATIENT,
  ADD_PATIENT_NOTE,
  REMOVE_PATIENT_NOTE,
  PIN_PATIENT_NOTE,
  UNPIN_PATIENT_NOTE,
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

export const setPatientLabelsFetching = () => ({
  type: SET_PATIENT_LABELS_FETCHING,
});

export const setPatientLabels = labels => ({
  type: SET_PATIENT_LABELS,
  payload: {
    labels,
  },
});

export const setPatientAttachmentsFetching = () => ({
  type: SET_PATIENT_ATTACHMENTS_FETCHING,
});

export const setPatientAttachments = attachments => ({
  type: SET_PATIENT_ATTACHMENTS,
  payload: {
    attachments,
  },
});

export const setCompleteTasksVisibility = completeTasksVisible => ({
  type: SET_COMPLETE_TASKS_VISIBILITY,
  payload: { completeTasksVisible },
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

export const updatePatientNote = (patientNoteIdentifier, note) => ({
  type: UPDATE_PATIENT_NOTE,
  payload: { patientNoteIdentifier, note },
});

export const archievePatient = (patientIdentifier, history) => ({
  type: ARCHIEVE_PATIENT,
  payload: { patientIdentifier, history },
});

export const updatePatientDetails = details => ({
  type: UPDATE_PATIENT_DETAILS,
  payload: { details },
});

export const addPatientNote = note => ({
  type: ADD_PATIENT_NOTE,
  payload: { note },
});

export const deletePatientNote = patientNoteIdentifier => ({
  type: REMOVE_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const pinPatientNote = patientNoteIdentifier => ({
  type: PIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const unpinPatientNote = patientNoteIdentifier => ({
  type: UNPIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});
