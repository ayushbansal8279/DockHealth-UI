/* eslint-disable sonarjs/no-identical-functions */
import * as PeopleApi from 'api/people-api';
import * as AlertActions from 'alert/actions';
import * as ActionTypes from './action-types';

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
  return dispatch =>
    PeopleApi.invitePersonToOrganization(formProps)
      .then(response => {
        if (response?.statusCode === 'FAILURE') {
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

export function resendInviteToOrganization(userIdentifier) {
  return dispatch =>
    PeopleApi.resendInviteToOrganization(userIdentifier)
      .then(response => {
        dispatch({ type: ActionTypes.INVITEPERSON_ORG_SUCCESS, response });
        dispatch(AlertActions.showGlobalAlert('Invitation resent!'));
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

export function cancelInviteToOrganization(markedUserIdentifier) {
  return dispatch =>
    PeopleApi.cancelInviteToOrganization(markedUserIdentifier)
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

export function addUserToOrganization(addedUserIdentifier) {
  return dispatch =>
    PeopleApi.addUserToOrganization(addedUserIdentifier)
      .then(response => {
        dispatch({ type: ActionTypes.ADD_USER_ORG_SUCCESS, response });
      })
      .catch(error => {
        throw error;
      });
}

export function getUserAvatar(user) {
  return dispatch =>
    PeopleApi.getUserAvatar(user)
      .then(image => {
        dispatch({ type: ActionTypes.GET_USER_AVATAR_SUCCESS, user });
        return image;
      })
      .catch(error => {
        throw error;
      });
}
