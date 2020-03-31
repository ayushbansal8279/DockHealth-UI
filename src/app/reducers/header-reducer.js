import { omit } from 'ramda';
import { HIDE_HEADER, SET_HEADER, UNSET_HEADER } from '../actions/action-types';
import palette from '../palette';

const initialState = {
  show: false,
  backgroundColor: palette.white,
  layout: [],
};

const reducer = (state = initialState, { type, ...payload }) => {
  const headerData = payload?.headerData ?? {};

  switch (type) {
    case SET_HEADER:
      return {
        ...initialState,
        show: true,
        ...headerData,
      };
    case UNSET_HEADER:
      return {
        ...state,
        ...omit(['show'], headerData),
      };
    case HIDE_HEADER:
      return { ...state, show: false };
    default:
      return state;
  }
};

export default reducer;
