import * as ActionTypes from './action-types';
import * as InvitationApi from '../api/invitation-api';
import * as TaskListApi from '../api/tasklist-api';

export function findInvitationsByUserId() {
  return function(dispatch) {
    return InvitationApi.findInvitationsByUserId().then(invitelist => {
      dispatch({type: ActionTypes.GET_INVITATION_SUCCESS, invitelist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function acceptInviteToTaskList(tasklist) {
  return function(dispatch) {
    return InvitationApi.acceptInviteToTaskList(tasklist.taskListId).then(res => {
      dispatch({type: ActionTypes.ACCEPT_INVITE_TOTASKLIST_SUCCESS, res, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function rejectInviteToTaskList(tasklist) {
  return function(dispatch) {
    return InvitationApi.rejectInviteToTaskList(tasklist.taskListId).then(res => {
      dispatch({type: ActionTypes.REJECT_INVITE_TOTASKLIST_SUCCESS, res, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function findPendingTaskListsForUser() {
  return function(dispatch) {
    return TaskListApi.findPendingTaskListsForUser().then(tasklist => {
      dispatch({type: ActionTypes.GET_PENDING_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}
