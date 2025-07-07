import * as ActionTypes from 'actions/action-types';

export const updateTaskInStore = (taskIdentifier, updatedTaskData) => ({
  type: ActionTypes.UPDATE_PROFILE_TASK,
  payload: {
    taskIdentifier,
    updatedTaskData,
  },
});

export const updateProfileTaskInList = (taskIdentifier, updatedTaskData) => ({
  type: ActionTypes.UPDATE_PROFILE_TASK_IN_LIST,
  payload: {
    taskIdentifier,
    updatedTaskData
  },
});

export const updateProfileTaskWorkflowStatus = (task, workflowStatus) => ({
  type: ActionTypes.UPDATE_PROFILE_WORKFLOW_STATUS,
  payload: {
    task,
    workflowStatus,
  },
});

export const CustomProfileDetailsActions = {
  updateTaskInStore,
  updateProfileTaskInList,
  updateProfileTaskWorkflowStatus
}