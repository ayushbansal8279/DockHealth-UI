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
    });
}

export function getListTasksByUser(taskListId, status, sortBy){
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(sortBy == undefined){
    closeAddForm()
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/'+taskListId+'?status='+status+'&queryStartPosition=0')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }else{
    closeAddForm()
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/'+taskListId+'?status='+status+'&queryStartPosition=0&sortBy='+sortBy)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }
}

export function getTasksAssignedToMe(taskListId, status, sortBy) {
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(taskListId != undefined){
    if(sortBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?taskListId='+taskListId+'&status='+status+'&sortBy='+sortBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?taskListId='+taskListId+'&status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      }).catch(function (error){
        console.log(error);
      });
    }
  }else{
    if(sortBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?status='+status+'&sortBy='+sortBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUser?status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }
  }
}

export function getTasksAssignedByMe(taskListId, status, sortBy){
  if(status == "INCOMPLETE"){
    // loading()
  }
  if(taskListId != undefined){
    if(sortBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?taskListId='+taskListId+'&status='+status+'&sortBy='+sortBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?taskListId='+taskListId+'&status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }
  }else{
    if(sortBy != undefined){
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?status='+status+'&sortBy='+sortBy)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }else{
      closeAddForm()
      return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?status='+status)
      .then(response => {
        return response.data;
      }).catch(function (error){
        console.log(error);
      });
    }
  }
}

export function addTask(task) {
  task.createdByUserId = sessionStorage.userId
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      return response.data;
  }).catch(function (error){
    console.log(error);
  });
}

export function updateTask(task) {
  task.createdByUserId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/' + task.taskId, task)
    .then(response => {
      return response.data;
  }).catch(function (error){
    console.log(error);
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
  });
}

export function markHighPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=HIGH')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
  });
}

export function markLowPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=LOW')
  .then(response => {
    return response;
  }).catch(function (error){
    console.log(error);
  });
}

export function assignOrReassignTask(taskId, assignedToUserId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/addOrUpdateTaskAssignment/' + taskId + '?assignedToUserId=' + assignedToUserId)
    .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
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
  });
}

export function getHighPriorityTasksByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findHighPriorityListTasks/'+taskListId+'?startPosition=0')
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
  });
}

export function getListTasksByPatient(patientId, status, taskListId){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByPatient/'+patientId+'/taskList/'+taskListId+'?status='+status)
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
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
    });
  }else{
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findInboxTasks?status='+status+'&queryStartPosition=0&sortBy='+sortBy)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
  }
}

export function flagUnread(taskId, flagUnread){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/flagUserTaskAsUnread/'+taskId+'?flagUnread='+flagUnread)
  .then(response => {
    return response.data;
  }).catch(function (error){
    console.log(error);
  });
}
