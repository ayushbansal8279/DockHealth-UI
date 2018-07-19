import axios from 'axios';
import configureStore from '../configureStore';
import * as ActionTypes from '../actions/action-types';

//import { getTasksSuccess, deleteTaskSuccess, addTaskSuccess } from '../actions/task-actions';

/**
 * Get all tasks for a user
 */
export function getTasksForCreator(userId) {
  userId = sessionStorage.userId
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksCreatedByUser')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function getListTasksByUser(taskListId, status, sortBy, filterBy){
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(sortBy == undefined && filterBy == undefined){
    closeAddForm()
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/'+taskListId+'?status='+status+'&queryStartPosition=0')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
  }else{
    closeAddForm()
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/'+taskListId+'?status='+status+'&queryStartPosition=0&sortBy='+sortBy+'&filterBy='+filterBy)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
  }
}

export function getTasksAssignedToMe(taskListId, status, sortBy, filterBy) {
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(taskListId != undefined){
    if(sortBy != undefined || filterBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?taskListId='+taskListId+'&status='+status+'&sortBy='+sortBy+'&filterBy='+filterBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?taskListId='+taskListId+'&status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }
  }else{
    if(sortBy != undefined || filterBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?status='+status+'&sortBy='+sortBy+'&filterBy='+filterBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }
  }
}

export function getTasksAssignedByMe(taskListId, status, sortBy, filterBy){
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(taskListId != undefined){
    if(sortBy != undefined || filterBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?taskListId='+taskListId+'&status='+status+'&sortBy='+sortBy+'&filterBy='+filterBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?taskListId='+taskListId+'&status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }
  }else{
    if(sortBy != undefined || filterBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?status='+status+'&sortBy='+sortBy+'&filterBy='+filterBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
        return error.response.data;
      });
    }
  }
}

export function searchTasks(searchTerm){
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/searchTasks?searchTerm='+searchTerm)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function addTask(task) {
  task.createdByUserId = sessionStorage.userId
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      return response.data;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function updateTask(task) {
  task.createdByUserId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/' + task.taskId, task)
    .then(response => {
      return response.data;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function deleteTask(taskId) {
  // userId = sessionStorage.userId
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/deleteTaskById/' + taskId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function duplicateTask(taskId) {
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/duplicateTask/' + taskId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response.data;
    }).catch(function (error){
      console.log(error);
      return error.response.data;
    });
}

export function markComplete(task){
  // userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + task.taskId + '?status=COMPLETE')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function markIncomplete(task){
  // userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + task.taskId + '?status=INCOMPLETE')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function updateTaskDescription(task, description){
  // userId = sessionStorage.userId
  // return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'')
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/'+task.taskId, {
    description: description
  })
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    return error.response.data;
  });
}

export function markHighPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=HIGH')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function markLowPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=LOW')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function assignOrReassignTask(taskId, assignedToUserId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/addOrUpdateTaskAssignment/' + taskId + '?assignedToUserId=' + assignedToUserId)
    .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

// export function listActiveUsersByTaskList(taskList){
//   return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'/heydoc-services/user/listAllUsersByTaskListId/'+taskListId+'?status=ACTIVE')
//   .then(response => {
//     return response.data;
//   });
// }

// task/changePriority/1?priorityLevel=HIGH&userId=1

export function addComment(taskId, taskComment) {
  // taskComment.creator.userId = sessionStorage.userId
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task/comment/'+ taskId, taskComment)
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
  
}

export function deleteComment(commentId) {
  // taskComment.creator.userId = sessionStorage.userId
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/comment/deleteCommentById/'+ commentId)
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function updateComment(comment) {
  // taskComment.creator.userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/comment', comment)
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function getHighPriorityTasksByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findHighPriorityListTasks/'+taskListId+'?startPosition=0')
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function getListTasksByPatient(patientId, status, taskListId){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByPatient/'+patientId+'/taskList/'+taskListId+'?status='+status)
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function getAllTasksByPatient(patientId, status){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findAllListTasksByPatient/'+patientId+'?status='+status)
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}

export function getInboxTasks(status, sortBy){
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(sortBy == undefined){
    closeAddForm()
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findInboxTasks?status='+status+'&queryStartPosition=0')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      throw(error)
    });
  }else{
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findInboxTasks?status='+status+'&queryStartPosition=0&sortBy='+sortBy)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
      throw(error)
    });
  }
}

export function flagUnread(taskId, flagUnread){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/flagUserTaskAsUnread/'+taskId+'?flagUnread='+flagUnread)
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
    throw(error)
  });
}
