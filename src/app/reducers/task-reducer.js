import {
  CHANGE_ADDING_NEW_SUBTASK,
  CHANGE_ADDING_NEW_TASK,
  GET_TASK_HISTORY_ERROR,
  GET_TASK_HISTORY_SUCCESS,
  REQUEST_HISTORY,
  SET_AS_CURRENT_TASK,
} from 'actions/action-types';

const initialState = {
  task: {},
  isHistoryFetching: false,
  historyError: null,
  currentTaskHistory: null,
  selectedTask: null,
  selectedTaskContext: null,
  selectedTaskId: null,
  addingNewSubtask: false,
  addingNewSubtaskParentId: null,
  subtaskShape: {},
  addingNewTask: false,
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const TaskReducer = (state = initialState, action) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case REQUEST_HISTORY:
      return requestHistory(state);

    case SET_AS_CURRENT_TASK:
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskContext: action.taskContext,
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

    default:
      return state;
  }
};

export default TaskReducer;
