import {
  SET_ACTIVE_TAB,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  CLEAR_PATIENT_TASKS,
} from 'actions/action-types';

const INITIAL_STATE = {
  activeTab: null,
  lists: [],
  incompleteTasksCount: null,
  completeTasksCount: null,
  isFetching: false,
  error: false,
};

export default function(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;

  // eslint-disable-next-line sonarjs/no-small-switch
  switch (type) {
    case CLEAR_PATIENT_TASKS:
      return {
        ...INITIAL_STATE,
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload?.activeTab,
      };
    case REQUEST_PATIENT_TASKS:
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case REQUEST_PATIENT_TASKS_SUCCESS:
      return {
        ...state,
        lists: payload?.lists,
        isFetching: false,
      };
    case REQUEST_PATIENT_TASKS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case REQUEST_PATIENT_STATS_SUCCESS:
      return {
        ...state,
        incompleteTasksCount: payload?.incompleteTasksCount,
        completeTasksCount: payload?.completeTasksCount,
      };
    case REQUEST_PATIENT_STATS_FAILURE:
      return {
        ...state,
        incompleteTasksCount: null,
        completeTasksCount: null,
      };

    default:
      return state;
  }
}
