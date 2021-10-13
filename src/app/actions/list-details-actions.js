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

export const getListDetailsGroupedTasks = payload => ({
  type: ActionTypes.GET_LIST_DETAILS_GROUPED_TASKS,
  payload,
});

export const refreshListDetailsGroupedTasks = withLoader => ({
  type: ActionTypes.REFRESH_LIST_DETAILS_GROUPED_TASKS,
  payload: {
    withLoader,
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

export function filterListDetailsTasks(filters) {
  return {
    type: ActionTypes.FILTER__LIST_DETAILS_TASKS,
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

export function applyTaskTemplate({
  taskTemplateIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
  unassign = false,
}) {
  return {
    type: ActionTypes.APPLY_TASK_TEMPLATE,
    taskTemplateIdentifier,
    taskListIdentifier,
    taskGroupIdentifier,
    options: {
      unassign,
    },
  };
}
