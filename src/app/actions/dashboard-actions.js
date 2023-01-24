import * as ActionTypes from 'actions/action-types';

export function initializeDashboardState(tabName) {
  return {
    type: ActionTypes.INITIALIZE_DASHBOARD_STATE,
    tabName,
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

export function getDashboardTasksForGroup(groupType) {
  return {
    type: ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP,
    groupType,
  };
}

export function getDashboardTasks() {
  return {
    type: ActionTypes.GET_DASHBOARD_TASKS,
  };
}

export function getDashboardFilters() {
  return {
    type: ActionTypes.GET_DASHBOARD_FILTERS,
  };
}

export function selectDashboardFilters(selectedFilters) {
  return {
    type: ActionTypes.SELECT_DASHBOARD_FILTERS,
    selectedFilters,
  };
}

export function reorderDashboardTasks(taskGroupImplicitType, tasksOrder) {
  return {
    type: ActionTypes.REORDER_DASHBOARD_TASKS,
    taskGroupImplicitType,
    tasksOrder,
  };
}

export function loadMoreDashboardTasksForGroup(groupType) {
  return {
    type: ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP,
    groupType,
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
