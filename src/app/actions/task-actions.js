import * as ActionTypes from '../actions/action-types';
import * as TaskApi from '../api/task-api'

export function getTasksForCreator(userId) {  
  return function(dispatch) {
    return TaskApi.getTasksForCreator(userId).then(tasks => {
      dispatch(getTasksForCreatorSuccess(tasks));
    }).catch(error => {
      throw(error);
    })
  }
}

function getTasksForCreatorSuccess(tasks) {  
  return {type: ActionTypes.GET_TASKS_SUCCESS, tasks};
}

export function getListTasksByUser(userId, taskListId) {  
  return function(dispatch) {
    return TaskApi.getListTasksByUser(userId, taskListId).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks));
    }).catch(error => {
      throw(error);
    })
  }
}

function getListTasksByUserSuccess(tasks) {  
  return {type: ActionTypes.GET_TASKS_SUCCESS, tasks};
}

// export function getListTasksByUser(userId, taskListId){
//   return function(dispatch){
//     return TaskApi.getListTasksByUser(userId, taskListId).then(tasks => {
//       dispatch(getListTasksByUserSuccess(tasks));
//     }).catch(error => {
//       throw(error);
//     })
//   }
// }

// function getListTasksByUserSuccess(tasks) {  
//   return {type: ActionTypes.GET_TASKS_SUCCESS, tasks};
// }

export function addTask(newTask) {  
  return function(dispatch) {
    return TaskApi.getTasksForCreator(newTask).then(task => {
      dispatch({type: ActionTypes.ADD_TASK_SUCCESS, task});
    }).catch(error => {
      throw(error);
    })
  }
}

export function deleteTask(task) {  
  return function(dispatch) {
    // return TaskApi.getTasksForCreator(newTask).then(task => {
      dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, task});
    // }).catch(error => {
      // throw(error);
    // });
  }
}

//checking
export function markComplete(taskId, userId, status) {  
  return function(dispatch){
    if(status == "INCOMPLETE"){
      return TaskApi.markComplete(taskId, userId).then(res => { // check for response value to be success      
        dispatch({type: ActionTypes.MARK_TASK_STATUS_SUCCESS, taskId, status:"COMPLETE"});
        }).catch(error => {
        throw(error);
      });
    }
    else if(status == "COMPLETE"){
      return TaskApi.markIncomplete(taskId, userId).then(res => { // check for response value to be success      
        dispatch({type: ActionTypes.MARK_TASK_STATUS_SUCCESS, taskId, status:"INCOMPLETE"});
        }).catch(error => {
        throw(error);
      });
    }
  };
}
