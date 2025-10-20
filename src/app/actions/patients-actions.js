import * as ActionTypes from './action-types';

export function initializePatientsListState(patientsListIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PATIENTS_LIST_STATE,
    patientsListIdentifier,
  };
}

export function initializeDynamicPatientsListState(patientsListIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_DYNAMIC_PATIENTS_LIST_STATE,
    patientsListIdentifier,
  };
}

export function getCurrentPatientsListDetails() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS,
  };
}

export function getCurrentPatients(workspaceIdentifier = null) {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS,
    payload: { workspaceIdentifier },
  };
}

export function silentlyGetCurrentPatients() {
  return {
    type: ActionTypes.SILENTLY_GET_CURRENT_PATIENTS,
  };
}

export function clearPatients() {
  return {
    type: ActionTypes.CLEAR_PATIENTS,
  };
}

export function getCurrentPatientsListFilterOptions() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS,
  };
}

export function searchPatients(searchTerm, workspaceIdentifier = null) {
  return {
    type: ActionTypes.SEARCH_PATIENTS,
    searchTerm,
    workspaceIdentifier,
  };
}

export function clearPatientSearch(searchTerm) {
  return {
    type: ActionTypes.CLEAR_PATIENT_SEARCH,
    searchTerm,
  };
}

export function changePatientsSearchTerm(searchTerm) {
  return {
    type: ActionTypes.CHANGE_PATIENTS_SEARCH_TERM,
    searchTerm,
  };
}

export function setPatientsSelectedFilters(
  selectedFilters,
  workspaceIdentifier,
) {
  return {
    type: ActionTypes.SET_PATIENTS_SELECTED_FILTERS,
    selectedFilters,
    workspaceIdentifier,
  };
}

export function setDynamicPatientsSelectedFilters(selectedFilters) {
  return {
    type: ActionTypes.SET_DYNAMIC_PATIENTS_SELECTED_FILTERS,
    selectedFilters,
  };
}

export function clearPatientsFilters() {
  return {
    type: ActionTypes.CLEAR_PATIENTS_FILTERS,
  };
}

export function getPatientsLists(workspaceIdentifier = null) {
  return {
    type: ActionTypes.GET_PATIENTS_LISTS,
    payload: { workspaceIdentifier },
  };
}

export function deletePatientsList(identifier) {
  return {
    type: ActionTypes.DELETE_PATIENTS_LIST,
    identifier,
  };
}

export function updatePatientsList(identifier, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_PATIENTS_LIST,
    identifier,
    dataToUpdate,
  };
}

export function updatePatientInCurrentPatientsList(
  patientIdentifier,
  dataToUpdate,
) {
  return {
    type: ActionTypes.UPDATE_PATIENT_IN_CURRENT_PATIENTS_LIST,
    payload: { patientIdentifier, dataToUpdate },
  };
}

export function updatePatientsListPreferences(payload) {
  return {
    type: ActionTypes.UPDATE_PATIENTS_LIST_PREFERENCES,
    payload,
  };
}

export function patientBulkCreateTask(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_CREATE_TASK,
    payload,
  };
}

export function patientAddLabel(payload) {
  return {
    type: ActionTypes.PATIENT_ADD_LABEL,
    payload,
  };
}

export function patientBulkAddLabel(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_ADD_LABEL,
    payload,
  };
}

export function patientBulkDeleteLabel(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_DELETE_LABEL,
    payload,
  };
}

export function patientDeleteLabel(payload) {
  return {
    type: ActionTypes.PATIENT_DELETE_LABEL,
    payload,
  };
}

export function patientBulkCreateWorkflow(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_CREATE_WORKFLOW,
    payload,
  };
}

export function patientBulkDeletePatient(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_DELETE_PATIENTS,
    payload,
  };
}

export function patientBulkUpdatePatient(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_UPDATE_PATIENTS,
    payload,
  };
}

export const updateListPreferences = (
  setup,
  patientListIdentifier,
  currentUserIdentifier,
  workspaceIdentifier = null,
) => ({
  type: ActionTypes.UPDATE_PATIENTS_LIST_PREFERENCES,
  payload: {
    setup,
    patientListIdentifier,
    currentUserIdentifier,
    workspaceIdentifier,
  },
});

export const selectDynamicPatientListFilter = (
  dynamicPatientListFilterIdentifier,
) => ({
  type: ActionTypes.SELECT_DYNAMIC_PATIENT_LIST_FILTER,
  dynamicPatientListFilterIdentifier,
});
