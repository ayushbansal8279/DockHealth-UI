/* eslint-disable sonarjs/no-small-switch */
import * as ActionTypes from 'actions/action-types';

const initialState = {
  tasks: null,
  isFetchingTasks: false,
  startDate: null,
  endDate: null,
};

const CalendarTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CHANGE_CALENDAR_DATE_RANGE: {
      const { startDate, endDate } = action;

      return {
        ...state,
        startDate,
        endDate,
      };
    }

    default:
      return state;
  }
};

export default CalendarTasksReducer;
