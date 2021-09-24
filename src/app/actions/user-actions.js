/* eslint-disable import/prefer-default-export */
import * as UserApi from 'api/user-api';
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
