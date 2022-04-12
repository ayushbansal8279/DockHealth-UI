import * as ActionTypes from 'actions/action-types';

// eslint-disable-next-line import/prefer-default-export
export function changeCalendarDateRange(startDate, endDate) {
  return {
    type: ActionTypes.CHANGE_CALENDAR_DATE_RANGE,
    startDate,
    endDate,
  };
}
