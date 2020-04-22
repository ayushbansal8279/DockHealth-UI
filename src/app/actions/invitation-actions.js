import * as InvitationApi from 'api/invitation-api';
import * as TaskListApi from 'api/tasklist-api';
import * as ActionTypes from './action-types';

export function findInvitationsByUserId() {
  return dispatch => {
    return InvitationApi.findInvitationsByUserId()
      .then(invitelist => {
        dispatch({ type: ActionTypes.GET_INVITATION_SUCCESS, invitelist });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function acceptInviteToTaskList(tasklist) {
  return dispatch => {
    return InvitationApi.acceptInviteToTaskList(tasklist.taskListIdentifier)
      .then(response => {
        dispatch({
          type: ActionTypes.ACCEPT_INVITE_TOTASKLIST_SUCCESS,
          res: response,
          tasklist,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function rejectInviteToTaskList(tasklist) {
  return dispatch => {
    return InvitationApi.rejectInviteToTaskList(tasklist.taskListIdentifier)
      .then(response => {
        dispatch({
          type: ActionTypes.REJECT_INVITE_TOTASKLIST_SUCCESS,
          res: response,
          tasklist,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function findPendingTaskListsForUser() {
  return dispatch => {
    return TaskListApi.findPendingTaskListsForUser()
      .then(tasklist => {
        dispatch({ type: ActionTypes.GET_PENDING_TASKLIST_SUCCESS, tasklist });
      })
      .catch(error => {
        throw error;
      });
  };
}
