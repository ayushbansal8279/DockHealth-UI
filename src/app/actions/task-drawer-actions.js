/* eslint-disable unicorn/consistent-function-scoping */
import {
  SET_TASK_DRAWER_STATE,
  OPEN_TASK_DRAWER_WITH_CONTENT,
} from './action-types';

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

export const openTaskDrawerWithContent = (task, focusField) => ({
  type: OPEN_TASK_DRAWER_WITH_CONTENT,
  open: true,
  task,
  focusField,
});
