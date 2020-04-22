import { SET_TASK_DRAWER_STATE } from 'actions/action-types';

const initialState = {
  open: false,
};

const reducer = (state = initialState, { type, payload }) => {
  if (type === SET_TASK_DRAWER_STATE) {
    return {
      ...state,
      open: payload.open,
    };
  }

  return {
    ...state,
  };
};

export default reducer;
