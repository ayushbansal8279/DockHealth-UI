import * as ActionTypes from 'actions/action-types';
import { TaskItemType } from 'helpers/task-helpers';
import { updateTasksStateCallback } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  userIdentifier: null,
  currentTasksStatus: null,
  userDetails: null,
  isFetchingUserDetails: false,
  completedTasks: null,
  tasks: null,
  tasksMap: {},
  isFetching: false,
  isCompletedTasksFetching: false,
  taskCounters: {},
  sort: {
    key: null,
    order: null,
  },
};

const mapTasksSuccess = (task) => ({
  ...task,
  subtasks: task.subtasks?.map((subtask) => ({
    ...subtask,
    patient: task.patient,
  })),
});

const PersonDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_USER: {
      return {
        ...state,
        userDetails: { ...state.userDetails, ...action.user },
      };
    }

    case ActionTypes.INITIALIZE_USER_DETAILS_STATE: {
      const { userIdentifier, currentTasksStatus } = action;

      return {
        ...initialState,
        userIdentifier,
        currentTasksStatus,
      };
    }

    case ActionTypes.CLEAR_USER_DETAILS_STATE: {
      return {
        ...initialState,
      };
    }

    case ActionTypes.CHANGE_CURRENT_TASKS_STATUS: {
      const { status } = action;

      return {
        ...state,
        currentTasksStatus: status,
      };
    }

    case ActionTypes.GET_USER_DETAILS: {
      return {
        ...state,
        isFetchingUserDetails: true,
      };
    }

    case ActionTypes.GET_USER_DETAILS_SUCCESS: {
      return {
        ...state,
        userIdentifier: action.user.userIdentifier,
        userDetails: action.user,
        isFetchingUserDetails: false,
      };
    }

    case ActionTypes.GET_USER_DETAILS_FAILURE: {
      return {
        ...state,
        userDetails: null,
        isFetchingUserDetails: false,
      };
    }

    case ActionTypes.GET_USER_TASKS: {
      return {
        ...state,
        isFetching: true,
      };
    }

    case ActionTypes.GET_USER_TASKS_SUCCESS: {
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
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
        isFetching: false,
      };

      // return { ...state, tasks: tasks.map(mapTasksSuccess), isFetching: false };
    }

    case ActionTypes.GET_USER_COMPLETED_TASKS: {
      return {
        ...state,
        isCompletedTasksFetching: true,
      };
    }

    case ActionTypes.GET_USER_COMPLETED_TASKS_SUCCESS: {
      const { tasks } = action;

      return {
        ...state,
        completedTasks: tasks.map(mapTasksSuccess),
        isCompletedTasksFetching: false,
        isFetching: false,
      };
    }

    case ActionTypes.GET_USER_TASK_COUNTERS_SUCCESS: {
      return {
        ...state,
        taskCounters: action.taskCounters,
      };
    }

    case ActionTypes.SORT_USER_TASKS: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
        completedTasks: null,
        tasks: null,
      };
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      return {
        ...state,
        tasks: [addedTask, ...(state.tasks || [])],
      };
    }

    default: {
      return TaskBaseReducer(state, action, updateTasksStateCallback);
    }
  }
};

export default PersonDetailsReducer;
