import * as ActionTypes from './action-types';
import * as TaskApi from '../api/tasklist-api'


//Find all TaskLists user belongs to
export function getTaskListForUser(userId) {
  return function(dispatch) {
    return TaskApi.getTaskListForUser(userId).then(tasklist => {
      dispatch({type: ActionTypes.GET_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      throw(error);
    });
  };
}
