import * as ActionTypes from '../actions/action-types';
import * as TaskApi from '../api/task-api'

export function getTasksForCreator(userId) {  
  return function(dispatch) {
    return TaskApi.getTasksForCreator(userId).then(tasks => {
      dispatch(getTasksForCreatorSuccess(tasks));
    }).catch(error => {
      throw(error);
    });
  };
}

function getTasksForCreatorSuccess(tasks) {  
  return {type: ActionTypes.GET_TASKS_SUCCESS, tasks};
}

export function addTask(newTask) {  
  return function(dispatch) {
    return TaskApi.getTasksForCreator(newTask).then(task => {
      dispatch({type: ActionTypes.ADD_TASK_SUCCESS, task});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTask(task) {  
  return function(dispatch) {
    // return TaskApi.getTasksForCreator(newTask).then(task => {
      dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, task});
    // }).catch(error => {
      // throw(error);
    // });
  };
}

//checking
export function markComplete(taskId, userId) {  
  return function(dispatch){
     return TaskApi.markComplete(taskId, userId).then(res => { // check for response value to be success      
      dispatch({type: ActionTypes.MARK_COMPLETE_SUCCESS, taskId, status:"COMPLETED"});
     }).catch(error => {
       throw(error);
     });
  };
}
