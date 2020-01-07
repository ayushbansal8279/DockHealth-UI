import { SET_HEADER, UNSET_HEADER, HIDE_HEADER } from '../actions/action-types';

const initialState = {
  show: false,
  backgroundColor: '#fff',
  layout: [],
};

const reducer = (state = initialState, { type, ...payload }) => {
  switch (type) {
    case SET_HEADER:
      return { ...state, show: true, ...(payload?.headerData ?? {}) };
    case UNSET_HEADER:
      return { ...initialState };
    case HIDE_HEADER:
      return { ...state, show: false };
    default:
      return state;
  }
};

export default reducer;
