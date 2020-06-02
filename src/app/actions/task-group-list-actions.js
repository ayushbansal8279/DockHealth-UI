/* eslint-disable import/prefer-default-export */
import * as ActionTypes from './action-types';

export function initializeGroups(groupList) {
  return dispatch => {
    dispatch({
      type: ActionTypes.TASK_GROUP_INITIALIZE,
      groupList,
    });
  };
}
