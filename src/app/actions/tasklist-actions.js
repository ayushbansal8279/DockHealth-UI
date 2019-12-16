import * as TaskListApi from '../api/tasklist-api';
import * as UserApi from '../api/user-api';
import { noop } from '../helpers/utility-functions';
import * as ActionTypes from './action-types';

export function getTaskListForUser() {
  return dispatch => {
    return TaskListApi.getTaskListForUser()
      .then(tasklist => {
        dispatch({ type: ActionTypes.GET_TASKLIST_SUCCESS, tasklist });
      })
      .catch(noop);
  };
}

export function loading() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_LISTS });
  };
}

export function setTaskListAsCurrentList(currentList) {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_CURRENT_LIST, currentList });
  };
}

export function saveTaskList(formProps) {
  if (formProps.taskListId != null && formProps.taskListId > 0) {
    return dispatch =>
      TaskListApi.updateTaskList(formProps)
        .then(updatedTasklist => {
          dispatch({
            type: ActionTypes.UPDATE_TASKLIST_SUCCESS,
            updatedTasklist,
          });
          toggleAlert('Task List updated successfully!', 'success');
        })
        .catch(noop);
  }

  return dispatch =>
    TaskListApi.addTaskList(formProps)
      .then(tasklist => {
        dispatch({ type: ActionTypes.ADD_TASKLIST_SUCCESS, tasklist });
        toggleAlert('Task List created successfully!', 'success');
      })
      .catch(noop);
}

export function getTaskListById(taskListId) {
  return dispatch =>
    TaskListApi.getTaskListById(taskListId)
      .then(currentList => {
        dispatch({ type: ActionTypes.SET_CURRENT_LIST, currentList });
      })
      .catch(noop);
}

export function getMembersByTaskListId(taskListId, memberStatus) {
  return dispatch =>
    TaskListApi.getMembersByTaskListId(taskListId, memberStatus)
      .then(tasklistmembers => {
        dispatch({
          type: ActionTypes.GET_TASKLISTMEMBERS_SUCCESS,
          taskListId,
          tasklistmembers,
        });
      })
      .catch(noop);
}

export function getActiveMembersByTaskListId(taskListId) {
  return dispatch =>
    TaskListApi.getMembersByTaskListId(taskListId, 'ACTIVE')
      .then(tasklistactivemembers => {
        dispatch({
          type: ActionTypes.GET_TASKLISTACTIVEMEMBERS_SUCCESS,
          tasklistactivemembers,
        });
      })
      .catch(noop);
}

export function invitePersonToTaskList(formProps, taskListId) {
  const personInfo = {
    email: formProps.email,
    firstName: formProps.firstName,
    lastName: formProps.lastName,
  };

  return dispatch =>
    TaskListApi.invitePersonToTaskList(taskListId, personInfo)
      .then(response => {
        dispatch({ type: ActionTypes.INVITEPERSON_TASKLIST_SUCCESS, response });
        toggleAlert('Invitation sent!', 'success');
      })
      .catch(noop);
}

export function getOrganizationUsersNotInTaskList(tasklistId) {
  return dispatch =>
    TaskListApi.getOrganizationUsersNotInTaskList(tasklistId)
      .then(users => {
        dispatch({
          type: ActionTypes.GET_ORGUSERSNOTINTASKLIST_SUCCESS,
          users,
        });
      })
      .catch(noop);
}

export const inviteUserToTaskList = (tasklistId, userId) => dispatch =>
  TaskListApi.inviteUserToTaskList(tasklistId, userId)
    .then(() => {
      dispatch({ type: ActionTypes.INVITE_USER_TO_TASKLIST_SUCCESS, userId });
    })
    .catch(noop);

export function inviteMultipleUsersToTaskList(tasklistId, invitedUsers) {
  return dispatch =>
    TaskListApi.inviteMultipleUsersToTaskList(tasklistId, invitedUsers)
      .then(response => {
        dispatch({
          type: ActionTypes.INVITEMULUSERS_TASKLIST_SUCCESS,
          response,
          invitedUsers,
        });
        toggleAlert('Invitations sent!', 'success');
      })
      .catch(noop);
}

export function getNonOrgUsersByTaskList(taskListId) {
  return dispatch =>
    TaskListApi.getNonOrgUsersByTaskList(taskListId)
      .then(users => {
        dispatch({
          type: ActionTypes.GET_NONORGUSERSINTASKLIST_SUCCESS,
          users,
        });
      })
      .catch(noop);
}

/**
 * Updates user's role in a list.
 * @param {number} tasklistId
 * @param {{userId: number}} markedUser
 * @param {('OWNER'|'ADMIN'|'MEMBER')} role
 * @returns {Promise}
 */
export function changeUserRoleForList(tasklistId, markedUser, role) {
  return dispatch =>
    TaskListApi.changeUserRoleForList(tasklistId, markedUser.userId, role)
      .then(response => {
        dispatch({
          type: ActionTypes.CHANGEUSERROLE_TASKLIST_SUCCESS,
          response,
          markedUser,
          role,
        });
      })
      .catch(noop);
}

export function deleteTaskListById(taskListId) {
  return dispatch =>
    TaskListApi.deleteTaskListById(taskListId)
      .then(response => {
        dispatch({
          type: ActionTypes.DELETE_TASKLIST_SUCCESS,
          response,
          taskListId,
        });
        toggleAlert('Task List deleted', 'success');
      })
      .catch(noop);
}

export function removeUserFromList(taskListId, removedUser) {
  return dispatch =>
    TaskListApi.removeUserFromList(taskListId, removedUser.userId)
      .then(response => {
        dispatch({
          type: ActionTypes.REMOVEUSER_TASKLIST_SUCCESS,
          response,
          removedUser,
        });
        toggleAlert('User removed successfully', 'success');
      })
      .catch(noop);
}

export function cancelInviteToTaskList(taskListId, email) {
  return dispatch =>
    TaskListApi.cancelInviteToTaskList(taskListId, email)
      .then(response => {
        dispatch({
          type: ActionTypes.CANCEL_TASKLIST_INVITE_SUCCESS,
          response,
        });
      })
      .catch(noop);
}

export function findAuditsByTaskList(taskListId, queryStartPosition) {
  return dispatch =>
    TaskListApi.findAuditsByTaskList(taskListId, queryStartPosition)
      .then(audits => {
        dispatch({ type: ActionTypes.GET_AUDITS_BY_TASKLIST_SUCCESS, audits });
      })
      .catch(noop);
}

export function findAuditsForAllTaskListsByUserId(queryStartPosition) {
  return dispatch =>
    TaskListApi.findAuditsForAllTaskListsByUserId(queryStartPosition)
      .then(auditsForAllUserList => {
        dispatch({
          type: ActionTypes.GET_AUDITS_BY_ALLUSERLIST_SUCCESS,
          auditsForAllUserList,
        });
      })
      .catch(noop);
}

export function findActivityFeedForAllTaskListsByUserId(queryStartPosition) {
  return dispatch =>
    TaskListApi.findActivityFeedForAllTaskListsByUserId(queryStartPosition)
      .then(activityFeedForAllUserList => {
        dispatch({
          type: ActionTypes.GET_ACTIVITYFEED_BY_ALLUSERLIST_SUCCESS,
          activityFeedForAllUserList,
        });
      })
      .catch(noop);
}

export function toggleListNotifications(taskListId, receiveNotifications) {
  return dispatch =>
    TaskListApi.toggleListNotifications(taskListId, receiveNotifications)
      .then(() => {
        dispatch({
          type: ActionTypes.TOGGLE_LIST_NOTIFICATIONS_SUCCESS,
          taskListId,
          receiveNotifications,
        });
      })
      .catch(noop);
}

export function storeAsCurrentList(taskListId) {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_AS_CURRENT_LIST, taskListId });
  };
}

export function isList(boolean) {
  return dispatch => {
    dispatch({ type: ActionTypes.IS_LIST, boolean });
  };
}

export function isInbox(boolean) {
  return dispatch => {
    dispatch({ type: ActionTypes.IS_INBOX, boolean });
  };
}

export function leaveList(taskListId) {
  return dispatch =>
    UserApi.leaveList(taskListId)
      .then(response => {
        dispatch({
          type: ActionTypes.DELETE_TASKLIST_SUCCESS,
          response,
          taskListId,
        });
      })
      .catch(noop);
}

export function getGenericListCounts() {
  return dispatch =>
    TaskListApi.findGenericListCountsForUser()
      .then(lists => {
        dispatch({ type: ActionTypes.SET_GENERIC_LIST_COUNTS, lists });
      })
      .catch(noop);
}

export function downloadPDF(taskListId) {
  return TaskListApi.downloadPDF(taskListId)
    .then(() => 'success')
    .catch(error => {
      throw error;
    });
}

// eslint-disable-next-line unicorn/consistent-function-scoping
export const getTaskListStats = ({ taskListId }) => async dispatch => {
  try {
    const { data } = await TaskListApi.getTaskListStats({ taskListId });
    dispatch({
      type: ActionTypes.GET_TASKLIST_STATS_SUCCESS,
      taskListStats: data,
    });
  } catch (error) {
    dispatch({ type: ActionTypes.GET_TASKLIST_STATS_FAILURE });
  }
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const resetTasklistStats = () => dispatch => {
  dispatch({
    type: ActionTypes.RESET_TASKLIST_STATS,
  });
};
