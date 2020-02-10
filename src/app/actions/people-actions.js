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

export function findAllUsers() {
  return dispatch =>
    PeopleApi.findAllUsers().then(peoplelist => {
      dispatch({ type: ActionTypes.GET_PEOPLE_SUCCESS, peoplelist });
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
      .then(response => {
        if (response.statusCode === 'FAILURE') {
          throw response;
        } else {
          dispatch({ type: ActionTypes.INVITEPERSON_ORG_SUCCESS, response });
        }
        return response;
      })
      .catch(error => {
        throw error;
      });
}

export function resendInviteToOrganization(email) {
  const personInfo = { email, organizationIdentifier: '1' };

  return dispatch =>
    PeopleApi.resendInviteToOrganization(personInfo)
      .then(response => {
        dispatch({ type: ActionTypes.INVITEPERSON_ORG_SUCCESS, response });
        toggleAlert('Invitation resent!', 'success');
      })
      .catch(error => {
        throw error;
      });
}

export function changeUserRoleForOrg(markedUserIdentifier, role) {
  return dispatch =>
    PeopleApi.changeUserRoleForOrg(markedUserIdentifier, role)
      .then(response => {
        dispatch({ type: ActionTypes.CHANGEUSERROLE_ORG_SUCCESS, response });
      })
      .catch(error => {
        throw error;
      });
}

export function cancelInviteToOrganization(markedUserEmail) {
  return dispatch =>
    PeopleApi.cancelInviteToOrganization(markedUserEmail)
      .then(response => {
        dispatch({
          type: ActionTypes.CANCEL_USER_ORG_INVITE_SUCCESS,
          response,
        });
      })
      .catch(error => {
        throw error;
      });
}

export function removeUserFromOrganization(removedUserIdentifier) {
  return dispatch =>
    PeopleApi.removeUserFromOrganization(removedUserIdentifier)
      .then(response => {
        dispatch({ type: ActionTypes.REMOVE_USER_ORG_SUCCESS, response });
      })
      .catch(error => {
        throw error;
      });
}

export function getUserById(userIdentifier) {
  return dispatch => {
    dispatch({
      type: ActionTypes.GET_USER_DETAILS_SUCCESS,
      user: null,
      userIdentifier,
    });

    return PeopleApi.getUserById(parseInt(userIdentifier, 10))
      .then(user => {
        dispatch({ type: ActionTypes.GET_USER_DETAILS_SUCCESS, user, userIdentifier });
      })
      .catch(error => {
        throw error;
      });
  };
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

export function getUserByEmail({ email }) {
  return dispatch =>
    PeopleApi.getUserByEmail({ email })
      .then(response => {
        dispatch({
          type: ActionTypes.GET_USER_DETAILS_SUCCESS,
          user: response,
        });
        return response;
      })
      .catch(error => {
        throw error;
      });
}
