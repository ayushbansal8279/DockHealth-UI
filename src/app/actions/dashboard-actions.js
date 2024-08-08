import * as ActionTypes from 'actions/action-types';

export function initializeDashboardState(tabName, taskViewFilter) {
  return {
    type: ActionTypes.INITIALIZE_DASHBOARD_STATE,
    tabName,
    taskViewFilter,
  };
}

export function clearDashboardState() {
  return {
    type: ActionTypes.CLEAR_DASHBOARD_STATE,
  };
}

export function getDashboardGroups() {
  return {
    type: ActionTypes.GET_DASHBOARD_GROUPS,
  };
}

export function getDashboardTasksForGroup(
  groupType,
  taskGroupIdentifier,
  sortBy,
  sortDirection,
) {
  return {
    type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP,
    groupType,
    taskGroupIdentifier,
    sortBy,
    sortDirection,
  };
}

export function getDashboardTasks() {
  return {
    type: ActionTypes.GET_DASHBOARD_TASKS,
  };
}

export function updateSortDashboardTasks(key, order) {
  return {
    type: ActionTypes.SORT_DASHBOARD_TASKS,
    key: order ? key : null,
    order,
  };
}

export function getDashboardGroupTasks(dashboardGroups, sortBy, sortDirection) {
  return {
    type: ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS,
    tasksList: dashboardGroups,
    sortBy,
    sortDirection,
  };
}

export function getDashboardFilters() {
  return {
    type: ActionTypes.GET_DASHBOARD_FILTERS,
  };
}

export function selectDashboardFilters(selectedFilters, selectedQuickFilter) {
  return {
    type: ActionTypes.SELECT_DASHBOARD_FILTERS,
    selectedFilters,
    selectedQuickFilter,
  };
}

export function reorderDashboardTasks(taskGroupImplicitType, tasksOrder) {
  return {
    type: ActionTypes.REORDER_DASHBOARD_TASKS,
    taskGroupImplicitType,
    tasksOrder,
  };
}

export function reorderDashboardTaskGroups(oldIndex, newIndex) {
  return {
    type: ActionTypes.REORDER_DASHBOARD_TASK_GROUPS,
    oldIndex,
    newIndex,
  };
}

export function loadMoreDashboardTasksForGroup(
  groupType,
  taskGroupIdentifier,
  sortBy,
  sortDirection,
) {
  return {
    type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP,
    groupType,
    taskGroupIdentifier,
    sortBy,
    sortDirection,
  };
}

export const searchDashboardTasks = (searchTerm) => ({
  type: ActionTypes.SEARCH_DASHBOARD_TASKS,
  searchTerm,
});

export function getDashboardCalendarTasks() {
  return {
    type: ActionTypes.GET_DASHBOARD_CALENDAR_TASKS,
  };
}

export function getDashboardCalendarTasksSuccess(tasks) {
  return {
    type: ActionTypes.GET_DASHBOARD_CALENDAR_TASKS_SUCCESS,
    tasks,
  };
}

export function getDashboardCalendarTasksFailure() {
  return {
    type: ActionTypes.GET_DASHBOARD_CALENDAR_TASKS_FAILURE,
  };
}

export function updateDashboardTaskViewFilter(newFilter) {
  return {
    type: ActionTypes.UPDATE_DASHBOARD_TASK_VIEW_FILTER,
    payload: newFilter,
  };
}
