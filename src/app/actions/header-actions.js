import { SET_HEADER, UNSET_HEADER, HIDE_HEADER } from './action-types';

export const setHeader = dispatch => headerData => {
  dispatch({
    type: SET_HEADER,
    headerData,
  });
};

export const unsetHeader = dispatch => () => {
  dispatch({
    type: HIDE_HEADER,
  });

  setTimeout(() => {
    dispatch({
      type: UNSET_HEADER,
    });
  }, 200);
};
