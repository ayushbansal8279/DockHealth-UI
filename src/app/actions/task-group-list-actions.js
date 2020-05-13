/* eslint-disable import/prefer-default-export */
import * as TaskGroupListApi from 'api/task-group-list-api';
import * as ActionTypes from './action-types';

export function getTaskGroupList(taskListIdentifier) {
  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    return TaskGroupListApi.getGroupsByListId(taskListIdentifier)
      .then(data => {
        dispatch({
          type: ActionTypes.TASK_GROUP_LIST_SUCCESS,
          groupList: data,
        });
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}

export function createTaskGroupList(payload) {
  const { taskListIdentifier } = payload;

  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    return TaskGroupListApi.createGroupAssignedToList(payload)
      .then(() => {
        dispatch(getTaskGroupList(taskListIdentifier));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}
