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



export function getListTasks(taskListId, sortBy){
  return function(dispatch){
    return TaskApi.getListTasksByUser(taskListId, "INCOMPLETE", sortBy).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks)).then(
        TaskApi.getListTasksByUser(taskListId, "COMPLETE", sortBy).then(tasks => {
          dispatch(getCompletedTasksSuccess(tasks));
        })
      )
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedToMe(taskListId) {
  return function(dispatch) {
    return TaskApi.getTasksAssignedToMe(taskListId, "INCOMPLETE").then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks)).then(
        TaskApi.getTasksAssignedToMe(taskListId, "COMPLETE").then(tasks => {
          dispatch(getCompletedTasksSuccess(tasks));
        })
      )
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedByMe(taskListId){
  return function(dispatch){
    return TaskApi.getTasksAssignedByMe(taskListId, "INCOMPLETE").then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks)).then(
        TaskApi.getTasksAssignedByMe(taskListId, "COMPLETE").then(tasks => {
          dispatch(getCompletedTasksSuccess(tasks));
        })
      )
    }).catch(error => {
      throw(error);
    })
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

export function saveTask(newTask) {
  if(newTask.taskId != null){
    return function(dispatch) {
      return TaskApi.updateTask(newTask).then(task => {
        dispatch({type: ActionTypes.UPDATE_TASK_SUCCESS, task});
      }).catch(error => {
        throw(error);
      })
    }
  }else{
    return function(dispatch) {
      return TaskApi.addTask(newTask).then(task => {
        dispatch({type: ActionTypes.ADD_TASK_SUCCESS, task});
      }).catch(error => {
        throw(error);
      })
    }
  }
}

export function addTaskComment(task, taskComment) {
  return function(dispatch) {
    return TaskApi.addComment(task.taskId, taskComment).then(comment => {
      dispatch({type: ActionTypes.ADD_TASK_COMMENT_SUCCESS, task, comment});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteTask(task) {
  return function(dispatch) {
    return TaskApi.deleteTask(task.taskId).then(deletingTask => {
      dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId:task.taskId});
    }).catch(error => {
      throw(error);
    });
  }
}

//checking
export function markComplete(task, status, listName) {
  var action = ""
  if(listName == "INCOMPLETE"){
    action = ActionTypes.MARK_TASK_STATUS_SUCCESS
  }else{
    action = ActionTypes.MARK_COMPLETE_TASK_STATUS_SUCCESS
  }
  return function(dispatch){
    if(status == "INCOMPLETE"){
      return TaskApi.markComplete(task).then(res => { // check for response value to be success
        dispatch({type: action, task, status:"COMPLETE"});
        }).catch(error => {
        throw(error);
      });
    }
    else if(status == "COMPLETE"){
      return TaskApi.markIncomplete(task).then(res => { // check for response value to be success
        dispatch({type: action, task, status:"INCOMPLETE"});
        }).catch(error => {
        throw(error);
      });
    }
  }
}

export function updateTaskDescription(taskId, description){
  return function(dispatch){
    return TaskApi.updateTaskDescription(taskId, description).then(res => {
      dispatch({type: ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS, taskId, description:description});
    }).catch(error => {
      throw(error);
    })
  }
}

export function toggleTaskPriority(task, userId, priority) {
  return function(dispatch){
    if(priority == "LOW"){
      return TaskApi.markHighPriority(task.taskId, userId).then(res => { // check for response value to be success
        dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, task, priority:"HIGH"});
        }).catch(error => {
        throw(error);
      });
    }
    else if(priority == "HIGH"){
      return TaskApi.markLowPriority(task.taskId, userId, priority).then(res => { // check for response value to be success
        dispatch({type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS, task, priority:"LOW"});
        }).catch(error => {
        throw(error);
      });
    }
  }
}

export function assignOrReassignTask(task, assignedToUserId, member){
  return function(dispatch){
    return TaskApi.assignOrReassignTask(task.taskId, assignedToUserId).then(res => {
      dispatch({type: ActionTypes.ASSIGN_OR_REASSIGN_TASK_SUCCESS, task, member});
    }).catch(error => {
      throw(error);
    })
  }
}

export function getListTasksByPatient(patientId, taskListId){
  return function(dispatch){
    return TaskApi.getListTasksByPatient(patientId, "INCOMPLETE", taskListId).then(tasks => {
      dispatch(getListTasksByUserSuccess(tasks)).then(
        TaskApi.getListTasksByPatient(patientId, "COMPLETE", taskListId).then(tasks => {
          dispatch(getCompletedTasksSuccess(tasks));
        })
      )
      }).catch(error => {
        throw(error);
    })
  }
}


export function getInboxTasks(sortBy){
  return function(dispatch){
    return TaskApi.getInboxTasks("INCOMPLETE", sortBy).then(tasks => {
      dispatch(getIncompleteTasksSuccess(tasks)).then(
        TaskApi.getInboxTasks("COMPLETE", sortBy).then(tasks => {
          dispatch(getCompletedTasksSuccess(tasks));
        })
      )
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

export function markAsUnread(task, flagUnread){
  return function(dispatch){
    return TaskApi.flagUnread(task.taskId, flagUnread).then(res => {
      dispatch({type: ActionTypes.FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS, task, flagUnread})
    }).catch(error => {
      throw(error)
    })
  }
}

export function taskToState(task){
  return function(dispatch){
    dispatch({type: ActionTypes.EDIT_TASK, task})
  }
}

export function storeAsCurrentTask(taskId){
  return function(dispatch){
    dispatch({type: ActionTypes.SET_AS_CURRENT_TASK, taskId})
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
