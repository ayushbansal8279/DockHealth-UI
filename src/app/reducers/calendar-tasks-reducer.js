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
    case ActionTypes.GET_CALENDAR_TASKS: {
      return {
        ...state,
        isFetchingTasks: true,
        tasks: null,
      };
    }

    case ActionTypes.GET_CALENDAR_TASKS_SUCCESS: {
      return {
        ...state,
        isFetchingTasks: false,
        tasks: action.tasks,
      };
    }

    case ActionTypes.GET_CALENDAR_TASKS_FAILURE: {
      return {
        ...state,
        isFetchingTasks: false,
      };
    }

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
