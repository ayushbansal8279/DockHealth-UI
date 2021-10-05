import * as ActionTypes from './action-types';

export function setCurrentUserGroup(groupIdentifier) {
  return {
    type: ActionTypes.SET_CURRENT_USER_GROUP,
    groupIdentifier,
  };
}

export function unsetCurrentUserGroup(groupIdentifier) {
  return {
    type: ActionTypes.UNSET_CURRENT_USER_GROUP,
    groupIdentifier,
  };
}

export function getUserGroupDetails(groupIdentifier) {
  return {
    type: ActionTypes.GET_USER_GROUP_DETAILS,
    groupIdentifier,
  };
}

export function getUserGroupDetailsSuccess(groupIdentifier, userGroupDetails) {
  return {
    type: ActionTypes.GET_USER_GROUP_DETAILS_SUCCESS,
    groupIdentifier,
    userGroupDetails,
  };
}

export function getUserGroupDetailsFailure(groupIdentifier) {
  return {
    type: ActionTypes.GET_USER_GROUP_DETAILS_FAILURE,
    groupIdentifier,
  };
}

export function getUserGroups() {
  return {
    type: ActionTypes.GET_USER_GROUPS,
  };
}

export function getUserGroupsSuccess(groups) {
  return {
    type: ActionTypes.GET_USER_GROUPS_SUCCESS,
    groups,
  };
}

export function getUserGroupsFailure() {
  return {
    type: ActionTypes.GET_USER_GROUPS_FAILURE,
  };
}

export function createUserGroup(userGroup, onSuccessCallback) {
  return {
    type: ActionTypes.CREATE_USER_GROUP,
    userGroup,
    onSuccessCallback,
  };
}

export function createUserGroupSuccess(userGroup) {
  return {
    type: ActionTypes.CREATE_USER_GROUP_SUCCESS,
    userGroup,
  };
}

export function createUserGroupFailure() {
  return {
    type: ActionTypes.CREATE_USER_GROUP_FAILURE,
  };
}

export function updateUserGroup(userGroupIdentifier, userGroupData) {
  return {
    type: ActionTypes.UPDATE_USER_GROUP,
    userGroupIdentifier,
    userGroupData,
  };
}

export function updateUserGroupSuccess(userGroupIdentifier, userGroupData) {
  return {
    type: ActionTypes.UPDATE_USER_GROUP_SUCCESS,
    userGroupIdentifier,
    userGroupData,
  };
}

export function updateUserGroupFailure(userGroupIdentifier) {
  return {
    type: ActionTypes.UPDATE_USER_GROUP_FAILURE,
    userGroupIdentifier,
  };
}

export function updateUsersInGroup(userGroupIdentifier, userIdentifiers) {
  return {
    type: ActionTypes.UPDATE_USERS_IN_GROUP,
    userGroupIdentifier,
    userIdentifiers,
  };
}

export function updateUsersInGroupSuccess(userGroupIdentifier, users) {
  return {
    type: ActionTypes.UPDATE_USERS_IN_GROUP_SUCCESS,
    userGroupIdentifier,
    users,
  };
}

export function updateUsersInGroupFailure(userGroupIdentifier) {
  return {
    type: ActionTypes.UPDATE_USERS_IN_GROUP_FAILURE,
    userGroupIdentifier,
  };
}

export function deleteUserGroup(userGroupIdentifier) {
  return {
    type: ActionTypes.DELETE_USER_GROUP,
    userGroupIdentifier,
  };
}

export function deleteUserGroupSuccess(userGroupIdentifier) {
  return {
    type: ActionTypes.DELETE_USER_GROUP_SUCCESS,
    userGroupIdentifier,
  };
}

export function deleteUserGroupFailure(userGroupIdentifier) {
  return {
    type: ActionTypes.DELETE_USER_GROUP_FAILURE,
    userGroupIdentifier,
  };
}
