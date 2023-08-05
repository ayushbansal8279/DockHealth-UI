import * as ActionTypes from 'actions/action-types';

const INITIAL_STATE = {
  selectedTaskIdentifiers: [],
};

const TaskItemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.TASK_ITEM_SELECT: {
      const { taskIdentifier } = action;

      return {
        ...state,
        selectedTaskIdentifiers: state.selectedTaskIdentifiers.concat([
          taskIdentifier,
        ]),
      };
    }

    case ActionTypes.TASK_ITEM_UNSELECT: {
      const { taskIdentifier } = action;

      return {
        ...state,
        selectedTaskIdentifiers: state.selectedTaskIdentifiers?.filter(
          (id) => id !== taskIdentifier,
        ),
      };
    }

    case ActionTypes.TASK_ITEM_UNSELECT_ALL: {
      return {
        ...state,
        selectedTaskIdentifiers: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default TaskItemReducer;
