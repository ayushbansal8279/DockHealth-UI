import * as ActionTypes from './action-types';

export function initializeProfileState(profileTypeIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PROFILE_STATE,
    profileTypeIdentifier,
  };
}

export function getProfileFilterOptions() {
  return {
    type: ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
  };
}
