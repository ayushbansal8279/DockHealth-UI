import * as ActionTypes from 'actions/action-types';

const initialState = {
  taskUIState: {},
};

const UIStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;
      return {
        ...state,
        taskUIState: {
          ...state.taskUIState,
          [taskIdentifier]: {
            ...state.taskUIState[taskIdentifier],
            subtaskQuickAddOpen: true,
          },
        },
      };
    }

    case ActionTypes.CLOSE_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;
      return {
        ...state,
        taskUIState: {
          ...state.taskUIState,
          [taskIdentifier]: {
            ...state.taskUIState[taskIdentifier],
            subtaskQuickAddOpen: false,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default UIStateReducer;
