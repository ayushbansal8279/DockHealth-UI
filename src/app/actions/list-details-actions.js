import * as ActionTypes from './action-types';

export function getListDetailsTaskCounters(taskListIdentifier) {
  return {
    type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    payload: {
      taskListIdentifier,
    },
  };
}

export const resetListDetailsTaskCounters = () => ({
  type: ActionTypes.RESET_LIST_DETAILS_TASK_COUNTERS,
});

export const getListDetailsGroupedTasks = ({
  withLoader,
  loadingMore,
  taskListIdentifier,
  status,
}) => ({
  type: ActionTypes.GET_LIST_DETAILS_GROUPED_TASKS,
  payload: {
    withLoader,
    loadingMore,
    taskListIdentifier,
    status,
  },
});

export const refreshListDetailsGroupedTasks = ({
  withLoader,
  loadingMore,
}) => ({
  type: ActionTypes.REFRESH_LIST_DETAILS_GROUPED_TASKS,
  payload: {
    withLoader,
    loadingMore,
  },
});

export function sortListDetailsTasks(key, order) {
  return {
    type: ActionTypes.SORT_LIST_DETAILS_TASKS,
    payload: {
      key,
      order,
    },
  };
}

export function setListDetailsTasksSort(key, order) {
  return {
    type: ActionTypes.SET_LIST_DETAILS_TASKS_SORT,
    payload: {
      key,
      order,
    },
  };
}

export function requestAllListDetailsGroups() {
  return {
    type: ActionTypes.REQUEST_ALL_LIST_DETAILS_GROUPS,
  };
}
