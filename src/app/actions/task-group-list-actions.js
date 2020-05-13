/* eslint-disable import/prefer-default-export */
import * as TaskGroupListApi from 'api/task-group-list-api';
import * as ActionTypes from './action-types';

export function createTaskGroupList(payload) {
  const { taskListIdentifier } = payload;

  return dispatch =>
    TaskGroupListApi.createGroupAssignedToList(payload)
      .then(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

        TaskGroupListApi.getGroupsByListId(taskListIdentifier)
          .then(() => {
            dispatch({ type: ActionTypes.TASK_GROUP_LIST_SUCCESS });
          })
          .catch(() => {
            dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
          });
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
}
