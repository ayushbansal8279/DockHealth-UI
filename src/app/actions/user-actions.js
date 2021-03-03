/* eslint-disable import/prefer-default-export */
import * as userApi from 'api/user-api';

import { setAuthBaseState } from 'actions/auth-base-actions';
import { AUTH_BASE_STATES } from 'reducers/auth-base-reducer';
import { USER_ACKNOWLEDGED_EULA } from './action-types';

// eslint-disable-next-line unicorn/consistent-function-scoping
export const acknowledgeEula = () => dispatch =>
  userApi.acknowledgeEula().then(() => {
    dispatch({ type: USER_ACKNOWLEDGED_EULA });
  });

export const approveOrDenyInvitation = ({
  requestIdentifier,
  decisionType,
  userIdentifier,
  dispatch,
}) => {
  // console.log('here');
  // userApi
  //   .approveOrDenyInvitation({
  //     requestIdentifier,
  //     decisionType,
  //     userIdentifier,
  //   })
  //   .then(() => {
  //     setAuthBaseState({
  //       authBaseState: AUTH_BASE_STATES.DAILY_HUB,
  //     })(dispatch);

  //     return getUserById(userIdentifier)
  //   });

  setAuthBaseState({
    authBaseState: AUTH_BASE_STATES.DAILY_HUB,
  })(dispatch);
};
