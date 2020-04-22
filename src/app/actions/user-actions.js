/* eslint-disable import/prefer-default-export */
import * as userApi from 'api/user-api';
import { USER_ACKNOWLEDGED_EULA } from './action-types';

// eslint-disable-next-line unicorn/consistent-function-scoping
export const acknowledgeEula = () => dispatch =>
  userApi.acknowledgeEula().then(() => {
    dispatch({ type: USER_ACKNOWLEDGED_EULA });
  });
