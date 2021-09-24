import * as TaskApi from 'api/task-api';
import * as UserApi from 'api/user-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from './action-types';

export function loading() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_PERSON_TASKS });
  };
}

export function loadingCompletedTasks() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_PERSON_COMPLETED_TASKS });
  };
}

export function getTasksAssignedToSpecificUser(userIdentifier, sortBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_PERSON_TASKS_SUCCESS
      : ActionTypes.GET_PERSON_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getTasksAssignedToSpecificUser(userIdentifier, sortBy, status)
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

const processTaskCountersSuccess = (data, dispatch) => {
  const payload = {
    incomplete: data
      ? data.find(({ metricName }) => metricName === 'INCOMPLETE_TASKS_COUNT')
          ?.metricValue
      : 0,
    complete: data
      ? data.find(({ metricName }) => metricName === 'COMPLETE_TASKS_COUNT')
          ?.metricValue
      : 0,
  };
  dispatch({ type: ActionTypes.GET_PERSON_TASK_COUNTERS_SUCCESS, payload });
};

export const getTaskStatsForUser = userIdentifier => dispatch => {
  return TaskApi.getTaskStatsForUser(userIdentifier).then(data => {
    processTaskCountersSuccess(data, dispatch);
  });
};

export const resetTaskCounters = () => ({
  type: ActionTypes.RESET_PERSON_TASK_COUNTERS,
});

export function getFilteredTasksForPeopleList(
  userIdentifier,
  sortBy,
  selectedFilters,
  status,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_PERSON_TASKS_SUCCESS
      : ActionTypes.GET_PERSON_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getFilteredTasksForPersonList(
      userIdentifier,
      sortBy,
      selectedFilters,
      status,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getUserById(userIdentifier) {
  return dispatch => {
    return UserApi.getUserById(userIdentifier)
      .then(user => {
        dispatch({
          type: ActionTypes.GET_PERSON_DETAILS_SUCCESS,
          user,
          userIdentifier,
        });
        return user;
      })
      .catch(error => {
        dispatch({
          type: ActionTypes.GET_PERSON_DETAILS_FAILURE,
        });
        throw error;
      });
  };
}

export function quickAddTask(newTask) {
  return dispatch => {
    return TaskApi.addTask(newTask)
      .then(task => {
        dispatch({ type: ActionTypes.ADD_TASK, task });
        dispatch({
          type: ActionTypes.CHANGE_ADDING_NEW_TASK,
          addingNewTask: false,
        });

        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
        return task;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function sortPersonTasks(key, order) {
  return {
    type: ActionTypes.SORT_PERSON_TASKS,
    payload: {
      key,
      order,
    },
  };
}
