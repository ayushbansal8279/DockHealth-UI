/* eslint-disable unicorn/consistent-function-scoping */
import { SET_TASK_DRAWER_STATE } from './action-types';

export const setDrawerState = ({ open }) => dispatch => {
  dispatch({
    type: SET_TASK_DRAWER_STATE,
    payload: {
      open,
    },
  });
};

export const openDrawer = () => dispatch => {
  setDrawerState({ open: true })(dispatch);
};

export const closeDrawer = () => dispatch => {
  setDrawerState({ open: false })(dispatch);
};
