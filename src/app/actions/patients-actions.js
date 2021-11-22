import * as ActionTypes from './action-types';

export function initializePatientsListState(patientsListIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PATIENTS_LIST_STATE,
    patientsListIdentifier,
  };
}

export function getCurrentPatientsListDetails() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS,
  };
}

export function getCurrentPatients() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS,
  };
}

export function getCurrentPatientsListFilterOptions() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS,
  };
}

export function changePatientsSearchTerm(searchTerm) {
  return {
    type: ActionTypes.CHANGE_PATIENTS_SEARCH_TERM,
    searchTerm,
  };
}

export function selectPatientsFilter(optionGroupIdentifier, optionIdentifier) {
  return {
    type: ActionTypes.SELECT_PATIENTS_FILTER,
    optionGroupIdentifier,
    optionIdentifier,
  };
}

export function unselectPatientsFilter(
  optionGroupIdentifier,
  optionIdentifier,
) {
  return {
    type: ActionTypes.UNSELECT_PATIENTS_FILTER,
    optionGroupIdentifier,
    optionIdentifier,
  };
}

export function clearPatientsFilters() {
  return {
    type: ActionTypes.CLEAR_PATIENTS_FILTERS,
  };
}

export function getPatientsLists() {
  return {
    type: ActionTypes.GET_PATIENTS_LISTS,
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
