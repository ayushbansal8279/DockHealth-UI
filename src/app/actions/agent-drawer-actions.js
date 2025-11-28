import * as ActionTypes from './action-types';

export function openAgentDrawer(agentType, taskData) {
  return {
    type: ActionTypes.OPEN_AGENT_DRAWER,
    agentType,
    taskData,
  };
}

export function closeAgentDrawer() {
  return {
    type: ActionTypes.CLOSE_AGENT_DRAWER,
  };
}

export function updateAgentTaskData(updatedData) {
  return {
    type: ActionTypes.UPDATE_AGENT_TASK_DATA,
    updatedData,
  };
}
