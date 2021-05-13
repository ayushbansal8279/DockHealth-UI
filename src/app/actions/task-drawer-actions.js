/* eslint-disable unicorn/consistent-function-scoping */
import { SET_TASK_DRAWER_STATE } from './action-types';

export const setDrawerState = ({ open, focusField }) => dispatch => {
  dispatch({
    type: SET_TASK_DRAWER_STATE,
    open,
    focusField,
  });
};

export const openDrawer = focusField => dispatch => {
  setDrawerState({ open: true, focusField })(dispatch);
};

export const closeDrawer = () => dispatch => {
  setDrawerState({ open: false, focusField: null })(dispatch);
};
