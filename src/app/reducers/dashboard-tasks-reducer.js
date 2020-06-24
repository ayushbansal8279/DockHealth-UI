import * as types from 'actions/action-types';

const initialState = {
  tasksList: [],
  isLoading: false,
  error: '',
};

const DashboardTasksReducer = (
  state = initialState,
  { type, tasksList, error },
) => {
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
      return state;
  }
};

export default DashboardTasksReducer;
