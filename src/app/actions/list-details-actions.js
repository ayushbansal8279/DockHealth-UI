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
    type: ActionTypes.FILTER_LIST_DETAILS_TASKS,
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

export function getListCustomFields(taskListIdentifier) {
  return {
    type: ActionTypes.GET_LIST_CUSTOM_FIELDS,
    taskListIdentifier,
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

export function deleteTaskListGroup(groupIdentifier) {
  return {
    type: ActionTypes.DELETE_TASK_LIST_GROUP,
    groupIdentifier,
  };
}

export function changeTaskListGroupName(groupIdentifier, name) {
  return {
    type: ActionTypes.CHANGE_TASK_LIST_GROUP_NAME,
    groupIdentifier,
    name,
  };
}

export function reorderTaskListGroups(oldIndex, newIndex) {
  return {
    type: ActionTypes.REORDER_TASK_LIST_GROUPS,
    oldIndex,
    newIndex,
  };
}
