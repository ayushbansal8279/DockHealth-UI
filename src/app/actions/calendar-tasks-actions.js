import * as ActionTypes from 'actions/action-types';

export function changeCalendarDateRange(startDate, endDate) {
  return {
    type: ActionTypes.CHANGE_CALENDAR_DATE_RANGE,
    startDate,
    endDate,
  };
}

export function clearCalendarTasksState() {
  return {
    type: ActionTypes.CLEAR_CALENDAR_TASKS_STATE,
  };
}
