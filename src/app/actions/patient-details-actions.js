import * as ActionTypes from 'actions/action-types';

export function initializePatientState(patientIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PATIENT_STATE,
    patientIdentifier,
  };
}
export function clearPatientState() {
  return {
    type: ActionTypes.CLEAR_PATIENT_STATE,
  };
}

export function getCurrentPatient() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT,
  };
}

export function getCurrentPatientLabels() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_LABELS,
  };
}

export function getCurrentPatientAttachments() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS,
  };
}

export function getCurrentPatientTasks() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_TASKS,
  };
}

export function getPatientFilterOptions() {
  return {
    type: ActionTypes.GET_PATIENT_FILTER_OPTIONS,
  };
}

export function changePatientTasksFilters(selectedFilters) {
  return {
    type: ActionTypes.CHANGE_PATIENT_TASKS_FILTERS,
    selectedFilters,
  };
}

export const updatePatientNote = (patientNoteIdentifier, note) => ({
  type: ActionTypes.UPDATE_PATIENT_NOTE,
  payload: { patientNoteIdentifier, note },
});

export const updatePatientDetails = details => ({
  type: ActionTypes.UPDATE_PATIENT_DETAILS,
  payload: { details },
});

export const addPatientNote = note => ({
  type: ActionTypes.ADD_PATIENT_NOTE,
  payload: { note },
});

export const deletePatientNote = patientNoteIdentifier => ({
  type: ActionTypes.REMOVE_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const pinPatientNote = patientNoteIdentifier => ({
  type: ActionTypes.PIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const unpinPatientNote = patientNoteIdentifier => ({
  type: ActionTypes.UNPIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export function togglePatientCompleteTasksVisible() {
  return {
    type: ActionTypes.TOGGLE_PATIENT_COMPLETE_TASKS_VISIBLE,
  };
}

export function getPatientTasksStats() {
  return {
    type: ActionTypes.GET_PATIENT_TASKS_STATS,
  };
}
