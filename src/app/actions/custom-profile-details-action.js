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

export const CustomProfileDetailsActions = {
  updateProfileTaskInList,
  updateTaskInStore
}