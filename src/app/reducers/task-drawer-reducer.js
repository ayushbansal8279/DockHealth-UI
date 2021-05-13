import {
  CHANGE_ADDING_NEW_SUBTASK,
  CHANGE_ADDING_NEW_TASK,
  GET_TASK_HISTORY_ERROR,
  GET_TASK_HISTORY_SUCCESS,
  REQUEST_HISTORY,
  SET_AS_CURRENT_TASK,
  TASK_READ_SUCCESS,
  SET_TASK_DRAWER_STATE,
} from 'actions/action-types';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  task: {},
  isHistoryFetching: false,
  historyError: null,
  currentTaskHistory: null,
  selectedTask: null,
  selectedTaskId: null,
  addingNewSubtask: false,
  addingNewSubtaskParentId: null,
  subtaskShape: {},
  addingNewTask: false,
  open: false,
  focusField: null,
};

const requestHistory = state => ({ ...state, isHistoryFetching: true });

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
    case REQUEST_HISTORY:
      return requestHistory(state);

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

    case SET_AS_CURRENT_TASK:
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskId: action.task != null ? action.task.taskIdentifier : null,
      };

    case GET_TASK_HISTORY_SUCCESS:
      return requestHistorySuccess(state, action);

    case GET_TASK_HISTORY_ERROR:
      return requestHistoryError(state, action);

    case CHANGE_ADDING_NEW_SUBTASK: {
      const {
        addingNewSubtask,
        addingNewSubtaskParentId,
        subtaskShape,
      } = action;
      return {
        ...state,
        addingNewSubtask,
        addingNewSubtaskParentId,
        subtaskShape,
      };
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

    default:
      if (state.selectedTask) {
        return TaskBaseReducer(
          state,
          action,
          (reducerState, updateTaskFromAction) => ({
            ...reducerState,
            selectedTask: updateTaskFromAction(state.selectedTask),
          }),
        );
      }

      return state;
  }
};

export default TaskReducer;
