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

function getIncompleteTasksSuccess(tasks) {
  return {type: ActionTypes.GET_TASKS_SUCCESS, tasks};
}

function getCompletedTasksSuccess(tasks){
  return {type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS, tasks}
}

export function getListTasksByUser(taskListId, status) {
  return function(dispatch) {
    if(status == "INCOMPLETE"){
      return TaskApi.getListTasksByUser(taskListId, status).then(tasks => {
        dispatch(getListTasksByUserSuccess(tasks));
      }).catch(error => {
        throw(error);
      })
    }
    else if(status == "COMPLETE"){
      return TaskApi.getListTasksByUser(taskListId, status).then(tasks => {
        dispatch({type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS, tasks});
      }).catch(error => {
        throw(error);
      })
    }
  }
}

// export function getCompletedListTasksByUser(taskListId) {
//   return function(dispatch) {
//     return TaskApi.getCompletedListTasksByUser(taskListId).then(tasks => {
//       dispatch(
//         return {type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS, tasks}
//       );
//     }).catch(error => {
//       throw(error);
//     })
//   }
// }

export function getTasksAssignedToUserByTaskListId(taskListId) {
  return function(dispatch) {
    return TaskApi.getTasksAssignedToUserByTaskListId(taskListId).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks));
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedByMe(taskListId){
  return function(dispatch){
    return TaskApi.getTasksAssignedByMe(taskListId).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks));
    }).catch(error => {
      throw(error);
    })
  }
}

export function getHighPriorityTasksByTaskList(taskListId){
  return function(dispatch){
    return TaskApi.getHighPriorityTasksByTaskList(taskListId).then(tasks => {
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

export function addTaskComment(taskId, taskComment) {
  return function(dispatch) {
    return TaskApi.addComment(taskId, taskComment).then(comment => {
      dispatch({type: ActionTypes.ADD_TASK_COMMENT_SUCCESS, taskId, comment});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTask(taskId, userId) {
  return function(dispatch) {
    return TaskApi.deleteTask(taskId, userId).then(task => {
      dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId});
    }).catch(error => {
      throw(error);
    });
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
  }
}

export function updateTaskDescription(taskId, userId, description){
  return function(dispatch){
    return TaskApi.updateTaskDescription(taskId, userId, description).then(res => {
      dispatch({type: ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS, taskId, description:description});
    }).catch(error => {
      throw(error);
    })
  }
}

export function toggleTaskPriority(taskId, userId, priority) {
  return function(dispatch){
    if(priority == "LOW"){
      return TaskApi.markHighPriority(taskId, userId).then(res => { // check for response value to be success
        dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, taskId, priority:"HIGH"});
        }).catch(error => {
        throw(error);
      });
    }
    else if(priority == "HIGH"){
      return TaskApi.markLowPriority(taskId, userId, priority).then(res => { // check for response value to be success
        dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, taskId, priority:"LOW"});
        }).catch(error => {
        throw(error);
      });
    }
  }
}

export function assignOrReassignTask(taskId, assignedByUserId, assignedToUserId, member){
  return function(dispatch){
    return TaskApi.assignOrReassignTask(taskId, assignedByUserId, assignedToUserId).then(res => {
      dispatch({type: ActionTypes.ASSIGN_OR_REASSIGN_TASK_SUCCESS, taskId, member:member});
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksByPatient(patientId, status){
  return function(dispatch){
    return TaskApi.getTasksByPatient(patientId, status).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks));
      }).catch(error => {
        throw(error);
    })
  }
}

export function getInboxTasks(){
  return function(dispatch){
    return TaskApi.getInboxTasks("INCOMPLETE").then(tasks => {
      dispatch(getIncompleteTasksSuccess(tasks));
      getCompletedInboxTasks();
    }).catch(error => {
      throw(error);
    })
  }
}

function getCompletedInboxTasks(){
  return function(dispatch){
    return TaskApi.getInboxTasks("COMPLETE").then(tasks => {
      dispatch(getCompletedTasksSuccess(tasks));
    }).catch(error => {
      throw(error);
    })
  }
}


// export function toggleTaskPriority(taskId, userId, priority){
//   return function(dispatch){
//     if(priority == "LOW"){}
//       return TaskApi.markHighPriority(taskId, userId).then(res => {
//         dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, taskId});
//         }).catch(error => {
//         throw(error);
//       });
//     }
//     else if(priority == "HIGH"){
//       return TaskApi.markLowPriority(taskId, userId).then(res => {
//         dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, taskId});
//         }).catch(error => {
//         throw(error);
//       });
//     }
//   }
// }
