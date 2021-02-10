import * as ActionTypes from './action-types';
import * as ActionTypesSaga from './action-types-saga';

export function getListDetailsTaskCounters(taskListIdentifier) {
  return {
    type: ActionTypesSaga.GET_LIST_DETAILS_TASK_COUNTERS,
    payload: {
      taskListIdentifier,
    },
  };
}

export const resetListDetailsTaskCounters = () => ({
  type: ActionTypes.RESET_LIST_DETAILS_TASK_COUNTERS,
});

export const getListDetailsGroupedTasks = payload => ({
  type: ActionTypesSaga.GET_LIST_DETAILS_GROUPED_TASKS,
  payload,
});

export const refreshListDetailsGroupedTasks = withLoader => ({
  type: ActionTypesSaga.REFRESH_LIST_DETAILS_GROUPED_TASKS,
  payload: {
    withLoader,
  },
});

export function sortListDetailsTasks(key, order) {
  return {
    type: ActionTypesSaga.SORT_LIST_DETAILS_TASKS,
    payload: {
      key,
      order,
    },
  };
}

export function filterListDetailsTasks(filters) {
  return {
    type: ActionTypesSaga.FILTER__LIST_DETAILS_TASKS,
    payload: {
      filters,
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
