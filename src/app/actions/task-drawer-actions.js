import * as ActionTypes from './action-types';

export const setDrawerState = ({ open, focusField }) => dispatch => {
  dispatch({
    type: ActionTypes.SET_TASK_DRAWER_STATE,
    open,
    focusField,
  });
};

export const openDrawer = focusField => dispatch => {
  setDrawerState({ open: true, focusField })(dispatch);
};

// eslint-disable-next-line unicorn/consistent-function-scoping
export const closeDrawer = () => dispatch => {
  setDrawerState({ open: false, focusField: null })(dispatch);
};

export const openTaskDrawerWithContent = (task, focusField) => {
  return {
    type: ActionTypes.OPEN_TASK_DRAWER_WITH_CONTENT,
    open: true,
    task,
    focusField,
  };
};

export const getTaskCustomFields = (taskIdentifier, taskListIdentifier) => ({
  type: ActionTypes.GET_TASK_CUSTOM_FIELDS,
  taskIdentifier,
  taskListIdentifier,
});

export function openTaskDrawerToAddTask(initialTaskState) {
  return { type: ActionTypes.OPEN_TASK_DRAWER_TO_ADD_TASK, initialTaskState };
}
