/* eslint-disable import/prefer-default-export */
import * as TaskGroupListApi from 'api/task-group-list-api';
import * as ActionTypes from './action-types';

export function getTaskGroupList(
  taskListIdentifier,
  shouldSetRequestState = true,
) {
  return dispatch => {
    if (shouldSetRequestState) {
      dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    }

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

    TaskGroupListApi.createGroupAssignedToList(payload)
      .then(() => {
        dispatch(getTaskGroupList(taskListIdentifier, false));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}

export function editTasksGroupName(listId, groupId, newGroupName) {
  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    TaskGroupListApi.editGroupName(listId, groupId, newGroupName)
      .then(() => {
        dispatch(getTaskGroupList(listId, false));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}

export function deleteTasksGroup(groupId, listId) {
  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    TaskGroupListApi.deleteGroup(groupId)
      .then(() => {
        dispatch(getTaskGroupList(listId, false));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}

export function sortTaskGroups(taskGroupIdentifiers, listId) {
  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    const payload = {
      taskGroupIdentifiers,
      taskListIdentifier: listId,
    };

    TaskGroupListApi.sortGroups(payload)
      .then(() => {
        dispatch(getTaskGroupList(listId, false));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}

export function reassignTasksToAnotherGroup(
  taskIdentifiers,
  taskGroupIdentifier,
  listIdentifier,
) {
  return dispatch => {
    dispatch({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    TaskGroupListApi.reassignTasksToAnotherGroup(
      taskGroupIdentifier,
      taskIdentifiers,
    )
      .then(() => {
        dispatch(getTaskGroupList(listIdentifier, false));
      })
      .catch(() => {
        dispatch({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
      });
  };
}
