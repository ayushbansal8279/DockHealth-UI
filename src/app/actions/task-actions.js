import * as TaskApi from '../api/task-api';
import * as ActionTypes from './action-types';

const shapeTask = (task) => {
  const { assignedTo, patient } = task;

  return {
    ...task,
    assignedToId: assignedTo ? assignedTo.userId : null,
    patientId: patient ? patient.patientId : null,
  };
};

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

export function getListTasks(taskListId, sortBy, filterBy, status){
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch){
    return TaskApi.getListTasksByUser(taskListId, status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){

      }
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedToMe(taskListId, sortBy, filterBy, status) {
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch) {
    return TaskApi.getTasksAssignedToMe(taskListId, status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){
        // loading()
      }
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedToSpecificUser(userId, taskListId, sortBy, filterBy, status) {
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch) {
    return TaskApi.getTasksAssignedToSpecificUser(userId, taskListId, status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){
        // loading()
      }
    }).catch(error => {
      throw(error);
    })
  }
}

export function getTasksAssignedByMe(taskListId, sortBy, filterBy, status){
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch){
    return TaskApi.getTasksAssignedByMe(taskListId, status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){
        // loading()
      }
    }).catch(error => {
      throw(error);
    })
  }
}

export function searchTasks(searchTerm, sortBy, filterBy, status){
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch){
    return TaskApi.searchTasks(searchTerm, status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){
        // loading()
      }
    }).catch(error => {
      throw(error);
    })
  }
}


export function loading(){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_TASKS})
  }
}

export function loadingCompletedTasks(){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_COMPLETED_TASKS})
  }
}

export function hideCompletedTasks(){
  return function(dispatch){
    dispatch({type: ActionTypes.HIDE_COMPLETED_TASKS})
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
      dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks});
    }).catch(error => {
      throw(error);
    })
  }
}

// export function getListTasksByUser(userId, taskListId){
//   return function(dispatch){
//     return TaskApi.getListTasksByUser(userId, taskListId).then(tasks => {
//       dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks});
//     }).catch(error => {
//       throw(error);
//     })
//   }
// }

export function saveTask(newTask) {
  if(newTask.taskId != null){
    return function(dispatch) {
      return TaskApi.updateTask(newTask).then(task => {
        dispatch({type: ActionTypes.UPDATE_TASK_SUCCESS, task});
        if(newTask.refiled == true){
          $('#task'+task.taskId).fadeOut(1000)
        }
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

export const moveTask = (task, taskList) => (dispatch) => {
  const updatedTask = {
    ...shapeTask(task),
    refiled: true,
    taskList: taskList.listName,
    taskListId: taskList.taskListId,
  };

  return TaskApi.updateTask(updatedTask).then(() => {
    dispatch({ type: ActionTypes.MOVE_TASK_SUCCESS, task });
  }).catch((error) => { throw error; });
};

export function addTaskComment(task, taskComment) {
  return function(dispatch) {
    return TaskApi.addComment(task.taskId, taskComment).then(comment => {
      dispatch({type: ActionTypes.ADD_TASK_COMMENT_SUCCESS, task, comment});
    }).catch(error => {
      throw(error);
    });
  };
}

export function deleteComment(task, comment) {
  return function(dispatch) {
    return TaskApi.deleteComment(comment.commentId).then(deletingComment => {
      dispatch({type: ActionTypes.DELETE_TASK_COMMENT_SUCCESS, task, comment});
      console.log(comment.commentId);
    }).catch(error => {
      throw(error);
    });
  }
}

export function updateComment(task, comment) {
  return function(dispatch) {
    return TaskApi.updateComment(comment).then(comment => {
      dispatch({type: ActionTypes.UPDATE_TASK_COMMENT_SUCCESS, task, comment});
    }).catch(error => {
      throw(error);
    });
  }
}

export function deleteTask(task) {
  return function(dispatch) {
    return TaskApi.deleteTask(task.taskId).then(deletingTask => {
      dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, task});
    }).catch(error => {
      throw(error);
    });
  }
}

export function duplicateTask(task) {
  return function(dispatch) {
    return TaskApi.duplicateTask(task.taskId).then(duplicatedTask => {
      dispatch({type: ActionTypes.DUPLICATE_TASK_SUCCESS, duplicatedTask});
    }).catch(error => {
      throw(error);
    });
  }
}

export function sortSubTask(task, direction) {
  return function(dispatch) {
    return TaskApi.sortSubTask(task.taskId, direction).then(task => {
      dispatch({type: ActionTypes.ORDER_SUB_TASK_SUCCESS, task});
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

export const updateTaskDescription = (task, description) => dispatch => (
  TaskApi.updateTaskDescription(task, description).then((res) => {
    dispatch({
      type: ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS,
      task,
      description: res.description,
    });
  }).catch((error) => {
    throw error;
  })
);

export const updateDueDate = (task, dueDate) => dispatch => (
  TaskApi.updateTask(shapeTask({ ...task, dueDate }))
    .then((res) => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_DUE_DATE,
        taskId: res.taskId,
        dueDate: res.dueDate,
      });
    })
    .catch((err) => { throw err; })
);

export const updatePatient = (task, patient) => dispatch => (
  TaskApi.updateTask(shapeTask({ ...task, patient }))
    .then((res) => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_PATIENT,
        taskId: res.taskId,
        patient: res.patient,
      });
    })
    .catch((err) => { throw err; })
);

export const updateReminder = (task, reminderDt) => dispatch => (
  TaskApi.updateTask(shapeTask({ ...task, reminderDt }))
    .then(() => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_REMINDER,
        taskId: task.taskId,
        reminderDt,
      });
    })
    .catch((err) => { throw err; })
);

export const updateWorkflowStatus = (taskId, workflowStatus) => dispatch => (
  TaskApi.updateWorkflowStatus(taskId, workflowStatus)
    .then(() => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_WORKFLOW_STATUS,
        taskId,
        workflowStatus,
      });
    })
    .catch((err) => { throw err; })
);

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
    return TaskApi.assignOrReassignTask(task.taskId, assignedToUserId).then(task => {
      dispatch({type: ActionTypes.ASSIGN_OR_REASSIGN_TASK_SUCCESS, task});
    }).catch(error => {
      throw(error);
    })
  }
}

export function getListTasksByPatient(patientId, taskListId){
  return function(dispatch){
    return TaskApi.getListTasksByPatient(patientId, "INCOMPLETE", taskListId).then(tasks => {
        dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks})
        TaskApi.getListTasksByPatient(patientId, "COMPLETE", taskListId).then(tasks => {
          dispatch({type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS, tasks});
        })
      }).catch(error => {
        throw(error);
    })
  }
}
export function getAllTasksByPatient(patientId, sortBy, filterBy, status){
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch){
    return TaskApi.getAllTasksByPatient(patientId, status, sortBy, filterBy).then(tasks => {
        dispatch({type: action, tasks})
      }).catch(error => {
        throw(error);
    })
  }
}

export function getInboxTasks(status, sortBy, filterBy){
  var action
  if(status == "INCOMPLETE"){
    action = ActionTypes.GET_TASKS_SUCCESS;
  }else{
    action = ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
  }
  return function(dispatch){
    return TaskApi.getInboxTasks(status, sortBy, filterBy).then(tasks => {
      dispatch({type: action, tasks});
      if(status == "INCOMPLETE"){
        // loading()
      }
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

export function getTaskHistory(task){
  return function(dispatch){
    dispatch({type: ActionTypes.REQUEST_HISTORY})

    return TaskApi.getTaskHistory(task.taskId).then(auditDetails => {
      dispatch({ type: ActionTypes.GET_TASK_HISTORY_SUCCESS, auditDetails })
    }).catch(error => {
      dispatch({ type: ActionTypes.GET_TASK_HISTORY_ERROR, error })
    })
  }
}

export function clearCurrentTaskHistory(){
  return function(dispatch){
    dispatch({type: ActionTypes.CLEAR_CURRENT_TASK_HISTORY})
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
