import * as ActionTypes from 'actions/action-types';

const initialState = {
  open: false,
  agentType: null,
  taskData: null,
  updatedData: null,
};

const AgentDrawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.OPEN_AGENT_DRAWER: {
      return {
        ...state,
        open: true,
        agentType: action.agentType,
        taskData: action.taskData,
      };
    }

    case ActionTypes.CLOSE_AGENT_DRAWER: {
      return {
        ...initialState,
      };
    }

    case ActionTypes.UPDATE_AGENT_TASK_DATA: {
      return {
        ...state,
        updatedData: action.updatedData,
      };
    }

    default:
      return state;
  }
};

export default AgentDrawerReducer;
