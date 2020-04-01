import { SET_AUTH_BASE_STATE } from './action-types';

// eslint-disable-next-line import/prefer-default-export
export const setAuthBaseState = ({ authBaseState }) => dispatch =>
  dispatch({
    type: SET_AUTH_BASE_STATE,
    payload: {
      authBaseState,
    },
  });
