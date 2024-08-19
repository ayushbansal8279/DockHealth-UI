import * as ActionTypes from './action-types';

export function initializeListDetailsTableState() {
  return {
    type: ActionTypes.INITIALIZE_LIST_DETAILS_TABLE_STATE,
  };
}

export function getListDetailsTaskCounters(taskListIdentifier) {
  return {
    type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    payload: {
      taskListIdentifier,
    },
  };
}

export function resetListDetailsTaskCounters() {
  return {
    type: ActionTypes.RESET_LIST_DETAILS_TASK_COUNTERS,
  };
}

export function getCurrentListTasks(withLoader) {
  return {
    type: ActionTypes.GET_CURRENT_LIST_TASKS,
    withLoader,
  };
}

export function searchCurrentListTasks(searchTerm) {
  return {
    type: ActionTypes.SEARCH_CURRENT_LIST_TASKS,
    searchTerm,
  };
}

export function getCurrentTaskListFilterOptions() {
  return {
    type: ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS,
  };
}

export const refreshListDetailsGroupedTasks = (withLoader) => ({
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

export function filterListDetailsTasks(filters, selectedQuickFilter) {
  return {
    type: ActionTypes.FILTER_LIST_DETAILS_TASKS,
    payload: {
      filters,
      selectedQuickFilter,
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

export function addListCustomField(addedCustomField) {
  return {
    type: ActionTypes.ADD_LIST_CUSTOM_FIELD,
    addedCustomField,
  };
}

export function updateListCustomField(updatedCustomField) {
  return {
    type: ActionTypes.UPDATE_LIST_CUSTOM_FIELD,
    updatedCustomField,
  };
}

export function deleteListCustomField(deletedCustomFieldIdentifier) {
  return {
    type: ActionTypes.DELETE_LIST_CUSTOM_FIELD,
    deletedCustomFieldIdentifier,
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

export function reorderTasksInGroup({ destination, source }) {
  return {
    type: ActionTypes.REORDER_TASKS_IN_GROUP,
    destination,
    source,
  };
}

export const reassignTasksToAnotherGroup = ({ destination, source }) => ({
  type: ActionTypes.REASSIGN_TASKS_TO_ANOTHER_GROUP,
  destination,
  source,
});

export const getTasksGroupsList = () => ({
  type: ActionTypes.GET_TASKS_GROUPS_LIST,
});

export const getTasksForTaskGroups = (payload) => ({
  type: ActionTypes.GET_TASKS_FOR_TASK_GROUP,
  ...payload,
});

export const createTaskListGroup = (groupName) => ({
  type: ActionTypes.CREATE_TASK_LIST_GROUP,
  groupName,
});

export const createTaskListGroupSuccess = (group) => ({
  type: ActionTypes.CREATE_TASK_LIST_GROUP_SUCCESS,
  group,
});

export const moveWorkflowToGroup = (
  identifier,
  taskGroupIdentifier,
  templateGroup,
) => ({
  type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_GROUP,
  identifier,
  taskGroupIdentifier,
  templateGroup,
});

export function getListCalendarTasks() {
  return {
    type: ActionTypes.GET_LIST_CALENDAR_TASKS,
  };
}

export function getListCalendarTasksSuccess(tasks) {
  return {
    type: ActionTypes.GET_LIST_CALENDAR_TASKS_SUCCESS,
    tasks,
  };
}

export function getListCalendarTasksFailure() {
  return {
    type: ActionTypes.GET_LIST_CALENDAR_TASKS_FAILURE,
  };
}

export function showhideWorkflowTasksReset() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WORKFLOW_SHOWHIDE_RESET,
    });
  };
}
