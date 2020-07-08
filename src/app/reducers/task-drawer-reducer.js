import { SET_TASK_DRAWER_STATE } from 'actions/action-types';

const initialState = {
  open: false,
  focusField: null,
};

const reducer = (state = initialState, { type, payload }) => {
  if (type === SET_TASK_DRAWER_STATE) {
    return {
      ...state,
      open: payload.open,
      focusField: payload.focusField,
    };
  }

  return {
    ...state,
  };
};

export default reducer;
