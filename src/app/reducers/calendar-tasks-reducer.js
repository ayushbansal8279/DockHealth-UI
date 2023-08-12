import * as ActionTypes from 'actions/action-types';
import { TaskItemType } from 'helpers/task-helpers';
import { updateTasksStateCallback } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  taskIdentifiers: null,
  tasksMap: {},
  isFetchingTasks: false,
  startDate: null,
  endDate: null,
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const CalendarTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_DASHBOARD_CALENDAR_TASKS:
    case ActionTypes.GET_LIST_CALENDAR_TASKS: {
      return {
        ...state,
        isFetchingTasks: true,
        tasksMap: {},
      };
    }

    case ActionTypes.GET_DASHBOARD_CALENDAR_TASKS_SUCCESS:
    case ActionTypes.GET_LIST_CALENDAR_TASKS_SUCCESS: {
      const { tasks } = action;
      const newMap = {};
      for (const task of tasks) {
        if (task.itemType === TaskItemType.TASK) {
          newMap[task.identifier] = task;
        } else {
          newMap[task.identifier] = task;
          for (const grpTask of task.tasks) {
            newMap[grpTask.identifier] = grpTask;
          }
        }
      }

      return {
        ...state,
        isFetchingTasks: false,
        taskIdentifiers: tasks.map((task) => task.identifier),
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
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

      const newMap = {};
      newMap[task.identifier ?? task.taskIdentifier] = task;

      return {
        ...state,
        taskIdentifiers: state.taskIdentifiers
          ? [...state.taskIdentifiers, task.identifier]
          : null,
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
      };
    }

    case ActionTypes.CLEAR_CALENDAR_TASKS_STATE: {
      return initialState;
    }

    default: {
      return state.startDate && state.startDate !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};

export default CalendarTasksReducer;
