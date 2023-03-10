import {
  CHANGE_ADDING_NEW_TASK,
  GET_TASK_HISTORY_ERROR,
  GET_TASK_HISTORY_SUCCESS,
  REQUEST_HISTORY,
  SET_AS_CURRENT_TASK,
  TASK_READ_SUCCESS,
  SET_TASK_DRAWER_STATE,
  OPEN_TASK_DRAWER_WITH_CONTENT,
  GET_TASK_CUSTOM_FIELDS,
  GET_TASK_CUSTOM_FIELDS_SUCCESS,
  GET_TASK_CUSTOM_FIELDS_FAILURE,
  OPEN_TASK_DRAWER_TO_ADD_TASK,
  SHOW_GLOBAL_ALERT,
  SET_AS_CURRENT_TASK_ERROR,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  error: false,
  task: {},
  isHistoryFetching: false,
  historyError: null,
  currentTaskHistory: null,
  selectedTask: null,
  selectedTaskId: null,
  addingNewTask: false,
  open: false,
  focusField: null,
  customFields: {
    isFetching: false,
    templates: [], // for backward compatibility
  },
  templatesMap: {},
};

const requestHistory = (state) => ({ ...state, isHistoryFetching: true });

const requestHistorySuccess = (state, { auditDetails }) => ({
  ...state,
  historyError: null,
  isHistoryFetching: false,
  currentTaskHistory: auditDetails,
});

const requestHistoryError = (state, { error }) => ({
  ...state,
  historyError: error,
  isHistoryFetching: false,
});

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_HISTORY: {
      return requestHistory(state);
    }

    case TASK_READ_SUCCESS: {
      const { task } = action;

      task.updated = false;
      task.updatedComment = false;
      task.updatedLabel = false;
      task.updatedAttachment = false;
      task.updatedDueDate = false;

      if (state.selectedTask) {
        return {
          ...state,
          selectedTask: { ...state.selectedTask, ...task },
        };
      }

      return state;
    }

    case SET_AS_CURRENT_TASK: {
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskId:
          action.task === undefined ? null : action?.task?.taskIdentifier,
        error: false,
      };
    }

    case SET_AS_CURRENT_TASK_ERROR: {
      return {
        ...state,
        error: true,
      };
    }

    case OPEN_TASK_DRAWER_TO_ADD_TASK: {
      return {
        ...state,
        selectedTask: action.initialTaskState,
        selectedTaskId: action.initialTaskState.taskIdentifier || null,
        open: true,
      };
    }

    case GET_TASK_HISTORY_SUCCESS: {
      return requestHistorySuccess(state, action);
    }

    case GET_TASK_HISTORY_ERROR: {
      return requestHistoryError(state, action);
    }

    case CHANGE_ADDING_NEW_TASK: {
      const { addingNewTask } = action;
      return {
        ...state,
        addingNewTask,
      };
    }

    case SET_TASK_DRAWER_STATE: {
      const { open, focusField } = action;

      return {
        ...state,
        open,
        focusField,
      };
    }

    case OPEN_TASK_DRAWER_WITH_CONTENT: {
      const { open, focusField, task } = action;

      return {
        ...state,
        error: false,
        open,
        focusField,
        selectedTask: task,
        selectedTaskId: task === undefined ? null : task.taskIdentifier,
      };
    }
    case GET_TASK_CUSTOM_FIELDS: {
      return {
        ...state,
        customFields: { ...state.customFields, isFetching: true },
      };
    }
    case GET_TASK_CUSTOM_FIELDS_SUCCESS: {
      const newMap = { ...state.templatesMap };

      if (action.taskIdentifier) {
        newMap[action.taskIdentifier] = action.customFieldsList;
      }

      return {
        ...state,
        customFields: {
          ...state.customFields,
          isFetching: false,
          templates: action.customFieldsList,
        },
        templatesMap: newMap,
      };
    }
    case GET_TASK_CUSTOM_FIELDS_FAILURE: {
      return {
        ...state,
        customFields: { ...state.customFields, isFetching: false },
      };
    }
    case SHOW_GLOBAL_ALERT: {
      return state;
    }

    default: {
      if (state.selectedTask) {
        return TaskBaseReducer(state, action, (reducerState, newTask) => {
          return {
            ...reducerState,
            selectedTask: newTask,
          };
        });
      }

      return state;
    }
  }
};

export default TaskReducer;
