import * as ActionTypes from './action-types';
import * as InvitationApi from '../api/invitation-api';

export function findInvitationsByUserId() {
  return function(dispatch) {
    return InvitationApi.findInvitationsByUserId().then(invitelist => {
      dispatch({type: ActionTypes.GET_INVITATION_SUCCESS, invitelist});
    }).catch(error => {
      throw(error);
    });
  };
}

export function acceptInviteToTaskList(tasklistId) {
  return function(dispatch) {
    return InvitationApi.acceptInviteToTaskList(tasklistId).then(res => {
      dispatch({type: ActionTypes.ACCEPT_INVITE_TOTASKLIST_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}

export function rejectInviteToTaskList(tasklistId) {
  return function(dispatch) {
    return InvitationApi.rejectInviteToTaskList(tasklistId).then(res => {
      dispatch({type: ActionTypes.REJECT_INVITE_TOTASKLIST_SUCCESS, res});
    }).catch(error => {
      throw(error);
    });
  };
}
