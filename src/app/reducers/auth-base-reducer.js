import { SET_AUTH_BASE_STATE } from 'actions/action-types';

export const AUTH_BASE_STATES = {
  DEFAULT: Symbol('DEFAULT'),
  DAILY_HUB: Symbol('DAILY_HUB'),
  REGAIN_CONTROL: Symbol('REGAIN_CONTROL'),
  APPROVE_DISAPPROVE: Symbol('APPROVE_DISAPPROVE'),
};

const initialState = {
  currentAuthBaseState: AUTH_BASE_STATES.DEFAULT,
};

const AuthBaseReducer = (state = initialState, { type, payload }) => {
  if (type === SET_AUTH_BASE_STATE) {
    return {
      ...state,
      currentAuthBaseState: payload.authBaseState,
    };
  }

  return state;
};

export default AuthBaseReducer;
