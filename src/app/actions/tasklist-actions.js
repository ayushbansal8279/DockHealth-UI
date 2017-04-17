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

//Create a new Task list
export function addTaskList(formProps) {
  var creator = {userId : '1'}
  var taskObject = {creator, listName: formProps.tasklistname};

  return function(dispatch) {
    return TaskApi.addTaskList(taskObject).then(tasklist => {
      dispatch({type: ActionTypes.ADD_TASKLIST_SUCCESS, tasklist});
    }).catch(error => {
      //console.log(error.message);
      throw(error);
      //return dispatch({type: ActionTypes.ADD_TASKLIST_FAILURE, errorMessage});
    });
  };
}
