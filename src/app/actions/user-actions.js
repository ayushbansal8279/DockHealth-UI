/* eslint-disable import/prefer-default-export */
import * as UserApi from 'api/user-api';
// import * as UserAuthApi from 'api/user-auth-api';
import * as ActionTypes from 'actions/action-types';

import { setAuthBaseState } from 'actions/auth-base-actions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';

// eslint-disable-next-line unicorn/consistent-function-scoping
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

export const sendUserOnboardingAnswers = ({ answers }) => {
  return UserApi.sendUserOnboardingAnswers({
    answers,
  });
};

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
