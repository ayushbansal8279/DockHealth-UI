import * as types from 'actions/action-types';

import TaskBaseReducer from './task-base-reducer';

const initialState = {
  isSearchingCompletedTasks: false,
  searchValue: '',
  lists: [],
  isLoading: false,
  error: '',
};

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    tasksList: updateTaskFromAction(state.tasksList),
  };
};

const GlobalSearchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SEARCH_COMPLETED_TASKS:
      return {
        ...state,
        isSearchingCompletedTasks: true,
      };

    case types.SEARCH_INCOMPLETED_TASKS:
      return {
        ...state,
        isSearchingCompletedTasks: false,
      };

    case types.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: payload?.value,
      };

    case types.GLOBAL_SEARCH_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.GLOBAL_SEARCH_REQUEST_SUCCESS:
      return {
        ...state,
        lists: payload?.lists,
        isLoading: false,
      };

    case types.GLOBAL_SEARCH_REQUEST_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case types.RESET_GLOBAL_SEARCH:
      return {
        ...state,
        ...initialState,
      };

    default:
      return TaskBaseReducer(state, action, 'search', updateTasksStateCallback);
  }
};

export default GlobalSearchReducer;
