import {
  GET_PERSON_TASKS_SUCCESS,
  GET_PERSON_COMPLETED_TASKS_SUCCESS,
  REQUEST_PERSON_TASKS,
  REQUEST_PERSON_COMPLETED_TASKS,
  RESET_PERSON_TASK_COUNTERS,
  GET_PERSON_TASK_COUNTERS_SUCCESS,
  GET_PERSON_DETAILS_SUCCESS,
  GET_PERSON_DETAILS_FAILURE,
  SORT_PERSON_TASKS,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  personData: null,
  completedTasks: [],
  tasks: [],
  isFetching: false,
  isCompletedTasksFetching: false,
  taskCounters: {},
  sort: {
    key: null,
    order: null,
  },
};

const mapTasksSuccess = task => ({
  ...task,
  subtasks: task.subtasks?.map(subtask => ({
    ...subtask,
    patient: task.patient,
  })),
});

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  const tasks = updateTaskFromAction(state.tasks || []);

  return {
    ...state,
    tasks,
    completedTasks: updateTaskFromAction(state.completedTasks || []),
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const PersonDetailsReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case GET_PERSON_DETAILS_SUCCESS:
      return {
        ...state,
        personData: action.user,
      };

    case GET_PERSON_DETAILS_FAILURE:
      return {
        ...state,
        personData: null,
      };

    case GET_PERSON_TASKS_SUCCESS: {
      const { tasks } = action;

      return { ...state, tasks: tasks.map(mapTasksSuccess), isFetching: false };
    }

    case GET_PERSON_COMPLETED_TASKS_SUCCESS: {
      const { tasks } = action;

      return {
        ...state,
        completedTasks: tasks.map(mapTasksSuccess),
        isCompletedTasksFetching: false,
        isFetching: false,
      };
    }

    case REQUEST_PERSON_TASKS:
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
      };

    case REQUEST_PERSON_COMPLETED_TASKS:
      return {
        ...state,
        completedTasks: [],
        isCompletedTasksFetching: true,
      };

    case RESET_PERSON_TASK_COUNTERS:
      return {
        ...state,
        taskCounters: {},
      };

    case GET_PERSON_TASK_COUNTERS_SUCCESS:
      return {
        ...state,
        taskCounters: action.payload,
      };

    case SORT_PERSON_TASKS: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default PersonDetailsReducer;
