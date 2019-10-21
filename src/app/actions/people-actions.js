import * as ActionTypes from './action-types';
import * as PeopleApi from '../api/people-api';

export function findAllUsersByOrganizationId() {
  return dispatch =>
    PeopleApi.findAllUsersByOrganizationId()
      .then(peoplelist => {
        dispatch({ type: ActionTypes.GET_PEOPLE_SUCCESS, peoplelist });
      })
      .catch(error => {
        throw error;
      });
}

export function loading() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_PEOPLE });
  };
}

export function invitePersonToOrganization(formProps) {
  const personInfo = {
    email: formProps.email,
    firstName: formProps.firstName,
    lastName: formProps.lastName,
  };

  return dispatch =>
    PeopleApi.invitePersonToOrganization(personInfo)
      .then(res => {
        if (res.statusCode === 'FAILURE') {
          toggleAlert(res.errorMessage, 'error');
        } else {
          dispatch({ type: ActionTypes.INVITEPERSON_ORG_SUCCESS, res });
          toggleAlert('Invitation sent!', 'success');
        }
        return res;
      })
      .catch(error => {
        // console.log(error.message);
        throw error;
      });
}

export function resendInviteToOrganization(email) {
  const personInfo = { email, organizationId: '1' };

  return dispatch =>
    PeopleApi.resendInviteToOrganization(personInfo)
      .then(res => {
        dispatch({ type: ActionTypes.INVITEPERSON_ORG_SUCCESS, res });
        toggleAlert('Invitation resent!', 'success');
      })
      .catch(error => {
        // console.log(error.message);
        throw error;
      });
}

export function changeUserRoleForOrg(markedUserId, role) {
  return dispatch =>
    PeopleApi.changeUserRoleForOrg(markedUserId, role)
      .then(res => {
        dispatch({ type: ActionTypes.CHANGEUSERROLE_ORG_SUCCESS, res });
      })
      .catch(error => {
        throw error;
      });
}

export function cancelInviteToOrganization(markedUserEmail) {
  return dispatch =>
    PeopleApi.cancelInviteToOrganization(markedUserEmail)
      .then(res => {
        dispatch({ type: ActionTypes.CANCEL_USER_ORG_INVITE_SUCCESS, res });
      })
      .catch(error => {
        throw error;
      });
}

export function removeUserFromOrganization(removedUserId) {
  return dispatch =>
    PeopleApi.removeUserFromOrganization(removedUserId)
      .then(res => {
        dispatch({ type: ActionTypes.REMOVE_USER_ORG_SUCCESS, res });
        toggleAlert('User removed successfully');
      })
      .catch(error => {
        throw error;
      });
}

export function getUserById(userId) {
  return dispatch =>
    PeopleApi.getUserById(parseInt(userId, 10))
      .then(user => {
        dispatch({ type: ActionTypes.GET_USER_DETAILS_SUCCESS, user, userId });
      })
      .catch(error => {
        throw error;
      });
}

export function getUserAvatar(user) {
  return dispatch =>
    PeopleApi.getUserAvatar(user)
      .then(() => {
        dispatch({ type: ActionTypes.GET_USER_AVATAR_SUCCESS, user });
      })
      .catch(error => {
        throw error;
      });
}
