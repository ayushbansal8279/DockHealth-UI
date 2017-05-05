import * as ActionTypes from './action-types';
import * as InvitationApi from '../api/invitation-api';

export function findInvitationsByUserId(userId) {
  return function(dispatch) {
    return InvitationApi.findInvitationsByUserId(userId).then(invitelist => {
      dispatch({type: ActionTypes.GET_INVITATION_SUCCESS, invitelist});
    }).catch(error => {
      throw(error);
    });
  };
}
