import {
  SEARCH_COMPLETED_TASKS,
  SEARCH_INCOMPLETED_TASKS,
  SET_SEARCH_VALUE,
  GLOBAL_SEARCH_REQUEST,
  GLOBAL_SEARCH_REQUEST_SUCCESS,
  GLOBAL_SEARCH_REQUEST_FAILURE,
  RESET_GLOBAL_SEARCH,
} from 'actions/action-types';

export const searchCompletedTasks = () => ({
  type: SEARCH_COMPLETED_TASKS,
});

export const searchIncompletedTasks = () => ({
  type: SEARCH_INCOMPLETED_TASKS,
});

export const setSearchValue = value => ({
  type: SET_SEARCH_VALUE,
  payload: { value },
});

export const requestGlobalSearch = () => ({
  type: GLOBAL_SEARCH_REQUEST,
});

export const requestGlobalSearchSuccess = lists => ({
  type: GLOBAL_SEARCH_REQUEST_SUCCESS,
  payload: { lists },
});

export const requestGlobalSearchFailure = () => ({
  type: GLOBAL_SEARCH_REQUEST_FAILURE,
});

export const resetGlobalSearch = () => ({
  type: RESET_GLOBAL_SEARCH,
});
