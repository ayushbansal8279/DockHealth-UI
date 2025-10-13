import * as ActionTypes from './action-types';

export function getUserPreferences(contextType, contextIdentifier) {
  return {
    type: ActionTypes.GET_USER_PREFERENCES,
    contextType,
    contextIdentifier,
  };
}

export function updateUserPreferences(
  contextType,
  contextIdentifier,
  partialDetails,
) {
  return {
    type: ActionTypes.UPDATE_USER_PREFERENCES,
    contextType,
    contextIdentifier,
    partialDetails,
  };
}

export function updateUserPreferencesSuccess(preferences) {
  return {
    type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
    preferences,
  };
}

export function updateMultipleSelectedQuickFilters(multipleSelectedQuickFilters) {
  return {
    type: ActionTypes.UPDATE_MULTIPLE_SELECTED_QUICK_FILTERS,
    multipleSelectedQuickFilters,
  };
}

export function updateTaskListStatus(contextType, contextIdentifier, status) {
  return {
    type: ActionTypes.UPDATE_TASK_LIST_STATUS,
    contextType,
    contextIdentifier,
    status,
  };
}
