import * as types from 'actions/action-types';

import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tasksList: [],
  isLoading: false,
  error: '',
};

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    tasksList: updateTaskFromAction(state.tasksList),
  };
};

const DashboardTasksReducer = (state = initialState, action) => {
  const { type, tasksList, error } = action;
  switch (type) {
    case types.REQUEST_DASHBOARD_TASKS:
      return {
        ...state,
        isLoading: true,
      };

    case types.REQUEST_DASHBOARD_TASKS_SUCCESS:
      return {
        tasksList,
        isLoading: false,
      };

    case types.REQUEST_DASHBOARD_TASKS_FAILURE:
      return {
        ...state,
        error,
        isLoading: false,
      };

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default DashboardTasksReducer;
