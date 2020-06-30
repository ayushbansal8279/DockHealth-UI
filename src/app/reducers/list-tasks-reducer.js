import {
  CLEAR_TASKS_SEARCH,
  GET_COMPLETED_TASKS_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE,
  GET_TASKS_SUCCESS,
  GET_TASKS_COUNT_SUCCESS,
  HIDE_COMPLETED_TASKS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_TASKS,
  TASK_NEW_PAGE_DOWNLOADED,
  GET_MORE_TASKS_REQUEST,
  TASK_COUNTERS_SUCCESS,
  RESET_TASK_COUNTERS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  TASK_ARCHIVED,
  UPDATE_TASK_SUCCESS,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  completedTasks: [],
  tasks: [],
  groupedTasks: {},
  newlyAddedTaskIds: [],
  isFetching: false,
  isCompletedTasksFetching: false,
  showingCompletedTasks: false,
  taskCountStats: null,
  isFetchingMoreTasks: false,
  taskCounters: {},
};

// const TASK_COMPLETE = 'COMPLETE';

// const updateMainTask = taskData =>
//   evolve({
//     ...map(always, taskData),
//     subtasks: map(
//       unless(propEq('status', TASK_COMPLETE), mergeDeepLeft(taskData)),
//     ),
//   });

// const updateSubTask = (taskData, subtask) =>
//   evolve({
//     subtasks: map(
//       when(
//         propEq('taskIdentifier', subtask.taskIdentifier),
//         mergeDeepLeft(taskData),
//       ),
//     ),
//   });

const mapTasksSuccess = task => ({
  ...task,
  subtasks: task.subtasks?.map(subtask => ({
    ...subtask,
    patient: task.patient,
  })),
});

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    tasks: updateTaskFromAction(state.tasks),
  };
};

const updateCompletedTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    completedTasks: updateTaskFromAction(state.completedTasks),
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const TaskReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case GET_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return { ...state, tasks, isFetching: false };
    }

    case GET_COMPLETED_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: tasks,
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: state.completedTasks.concat(tasks),
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
        isFetchingMoreTasks: false,
      };
    }

    case GET_TASKS_COUNT_SUCCESS: {
      const { stats } = action;
      return { ...state, taskCountStats: stats };
    }

    case REQUEST_TASKS:
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
        showingCompletedTasks: false,
      };

    case REQUEST_COMPLETED_TASKS:
      return {
        ...state,
        completedTasks: [],
        isCompletedTasksFetching: true,
      };

    case RESET_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: {},
      };

    case TASK_COUNTERS_SUCCESS:
      return {
        ...state,
        taskCounters: action.payload,
        completedTasksCounter: action.payload.completedTasksCounter,
      };

    case CLEAR_TASKS_SEARCH:
      return {
        ...state,
        tasks: [],
        completedTasks: [],
      };

    case HIDE_COMPLETED_TASKS:
      return { ...state, showingCompletedTasks: false, completedTasks: [] };

    case TASK_NEW_PAGE_DOWNLOADED: {
      const { tasks: actionTasks, status } = action;

      const stateTasksKey = status === 'COMPLETE' ? 'completedTasks' : 'tasks';

      return {
        ...state,
        [stateTasksKey]: [
          ...(state[stateTasksKey] || []),
          ...(actionTasks || []),
        ],
      };
    }

    case GET_MORE_TASKS_REQUEST: {
      return { ...state, isFetchingMoreTasks: true };
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS:
    case TASK_ARCHIVED: {
      return TaskBaseReducer(
        state,
        action,
        'list',
        updateCompletedTasksStateCallback,
      );
    }

    case UPDATE_TASK_SUCCESS: {
      const mode = 'list';
      if (action.task.status === 'COMPLETE') {
        return TaskBaseReducer(
          state,
          action,
          mode,
          updateCompletedTasksStateCallback,
        );
      }
      return TaskBaseReducer(state, action, mode, updateTasksStateCallback);
    }

    default:
      return TaskBaseReducer(state, action, 'list', updateTasksStateCallback);
  }
};

export default TaskReducer;
