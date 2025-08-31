import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from './action-types';

export function initializeUserDetailsState(userIdentifier, currentTasksStatus) {
  return {
    type: ActionTypes.INITIALIZE_USER_DETAILS_STATE,
    userIdentifier,
    currentTasksStatus,
  };
}

export function clearUserDetailsState() {
  return {
    type: ActionTypes.CLEAR_USER_DETAILS_STATE,
  };
}

export function getUserDetails() {
  return {
    type: ActionTypes.GET_USER_DETAILS,
  };
}
export function getUserTaskCounters() {
  return {
    type: ActionTypes.GET_USER_TASK_COUNTERS,
  };
}

export function getUserTaskFilterOptions() {
  return {
    type: ActionTypes.GET_USER_TASK_FILTER_OPTIONS,
  };
}

export function getUserTasks(status) {
  return {
    type: ActionTypes.GET_USER_TASKS,
    status,
  };
}
export function changeCurrentTasksStatus(status) {
  return {
    type: ActionTypes.CHANGE_CURRENT_TASKS_STATUS,
    status,
  };
}

export function refreshUserTasks() {
  return {
    type: ActionTypes.REFRESH_USER_TASKS,
  };
}

export function sortUserTasks(key, order) {
  return {
    type: ActionTypes.SORT_USER_TASKS,
    payload: {
      key: order ? key : null,
      order,
    },
  };
}

export function quickAddTask(newTask) {
  return (dispatch) =>
    TaskApi.addTask(newTask)
      .then((task) => {
        dispatch({ type: ActionTypes.ADD_TASK_SUCCESS, task });
        dispatch({
          type: ActionTypes.CHANGE_ADDING_NEW_TASK,
          addingNewTask: false,
        });

        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
        return task;
      })
      .catch((error) => {
        throw error;
      });
}

export function updateUser(user) {
  return {
    type: ActionTypes.UPDATE_USER,
    user,
  };
}
