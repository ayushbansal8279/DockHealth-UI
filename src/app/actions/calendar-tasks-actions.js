import * as ActionTypes from 'actions/action-types';

export function changeCalendarDateRange(startDate, endDate) {
  return {
    type: ActionTypes.CHANGE_CALENDAR_DATE_RANGE,
    startDate,
    endDate,
  };
}

export function getCalendarTasks() {
  return {
    type: ActionTypes.GET_CALENDAR_TASKS,
  };
}

export function getCalendarTasksSuccess(tasks) {
  return {
    type: ActionTypes.GET_CALENDAR_TASKS_SUCCESS,
    tasks,
  };
}

export function getCalendarTasksFailure() {
  return {
    type: ActionTypes.GET_CALENDAR_TASKS_FAILURE,
  };
}
