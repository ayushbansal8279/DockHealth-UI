import * as ActionTypes from 'actions/action-types';

const INITIAL_STATE = {
  isLoading: false,
  filters: null,
  selectedFilters: null,
  error: null,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, error, selectedFilters } = action;

  switch (type) {
    case ActionTypes.GET_DASHBOARD_FILTERS:
    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.GET_DASHBOARD_FILTERS_SUCCESS:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_SUCCESS:
    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        filters: action.filters,
        isLoading: false,
      };

    case ActionTypes.GET_USER_TASK_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_DASHBOARD_FILTERS_FAILURE:
    case ActionTypes.GET_PATIENT_FILTER_OPTIONS_FAILURE:
    case ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_FAILURE:
      return { ...state, error, isLoading: false };

    case ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER:
      return { ...state, selectedFilters };

    case ActionTypes.CLEAR_MEGA_FILTERS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
