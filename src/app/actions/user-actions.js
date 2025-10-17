import * as UserApi from 'api/user-api';
// import * as UserAuthApi from 'api/user-auth-api';
import * as ActionTypes from 'actions/action-types';

import { setAuthBaseState } from 'actions/auth-base-actions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

export const acknowledgeEula = () => UserApi.acknowledgeEula();

export const approveOrDenyInvitation = ({
  requestIdentifier,
  decisionType,
  userIdentifier,
  dispatch,
}) => {
  setAuthBaseState({
    authBaseState: AUTH_BASE_STATES.APPROVE_DISAPPROVE,
  })(dispatch);

  return UserApi.approveOrDenyInvitation({
    requestIdentifier,
    decisionType,
    userIdentifier,
  });
};

export const sendUserOnboardingAnswers = ({ answers }) =>
  UserApi.sendUserOnboardingAnswers({
    answers,
  });

export function getCurrentUserNotificationPreferences() {
  return {
    type: ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES,
  };
}

export function updateCurrentUserPreferences(preferences) {
  return {
    type: ActionTypes.UPDATE_CURRENT_USER_PREFERENCES,
    preferences,
  };
}

export function getCurrentUser() {
  return {
    type: ActionTypes.GET_CURRENT_USER,
  };
}

export function updateCurrentUser(userData) {
  return {
    type: ActionTypes.UPDATE_CURRENT_USER,
    userData,
  };
}

export function getCurrentUserOrganizations() {
  return {
    type: ActionTypes.GET_CURRENT_USER_ORGANIZATIONS,
  };
}

export function removeOrganizationFromOrganizations(orgId) {
  return {
    type: ActionTypes.REMOVE_ORGANIZATION_FROM_ORGANIZATIONS,
    payload: { orgId },
  };
}

export function userBulkCreateTask(payload) {
  return {
    type: ActionTypes.USER_BULK_CREATE_TASK,
    payload,
  };
}

export function userBulkCreateWorkflow(payload) {
  return {
    type: ActionTypes.USER_BULK_CREATE_WORKFLOW,
    payload,
  };
}

export function filterUserDetailsTasks(filters,userIdentifier) {
  return {
    type: ActionTypes.FILTER_USER_DETAILS_TASKS,
    filters,
    userIdentifier,
  };
}
