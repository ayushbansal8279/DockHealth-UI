import * as ActionTypes from 'actions/action-types';
import { mapWithRemove } from 'helpers/utility-functions';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tasks: null,
  isFetchingTasks: false,
  startDate: null,
  endDate: null,
};

const CalendarTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_DASHBOARD_CALENDAR_TASKS:
    case ActionTypes.GET_LIST_CALENDAR_TASKS: {
      return {
        ...state,
        isFetchingTasks: true,
        tasks: null,
      };
    }

    case ActionTypes.GET_DASHBOARD_CALENDAR_TASKS_SUCCESS:
    case ActionTypes.GET_LIST_CALENDAR_TASKS_SUCCESS: {
      return {
        ...state,
        isFetchingTasks: false,
        tasks: action.tasks,
      };
    }

    case ActionTypes.GET_DASHBOARD_CALENDAR_TASKS_FAILURE:
    case ActionTypes.GET_LIST_CALENDAR_TASKS_FAILURE: {
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

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task } = action;

      return {
        ...state,
        tasks: state.tasks ? [...state.tasks, task] : null,
      };
    }

    case ActionTypes.CLEAR_CALENDAR_TASKS_STATE: {
      return initialState;
    }

    default:
      return TaskBaseReducer(
        state,
        action,
        (currentState, updateTaskCallback) => ({
          ...currentState,
          tasks: currentState.tasks
            ? mapWithRemove(updateTaskCallback, currentState.tasks)
            : null,
        }),
      );
  }
};

export default CalendarTasksReducer;
