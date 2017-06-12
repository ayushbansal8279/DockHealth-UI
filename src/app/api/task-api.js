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
    });
}

export function getListTasksByUser(taskListId, status){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/'+taskListId+'?status='+status+'&queryStartPosition=0')
  .then(response => {
    return response.data;
  });
}

// export function getTasksByDueDate(userId) {
//   return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'')
// }

/**
 * Search tasks
 */
// export function searchTasks(query = '') {
//   return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task?q='+ query)
//     .then(response => {
//       store.dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks: response.data});
//       return response;
//     });
// }

export function addTask(task) {
  task.createdByUserId = sessionStorage.userId
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      // store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response.data;
    });
}

export function deleteTask(taskId, userId) {
  // userId = sessionStorage.userId
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/deleteTaskById/' + taskId + '?deleterId=' + userId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response;
    });
}

export function markComplete(task){
  // userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + task.taskId + '?status=COMPLETE')
  .then(response => {
    return response;
  });
}

export function markIncomplete(task){
  // userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + task.taskId + '?status=INCOMPLETE')
  .then(response => {
    return response;
  });
}

export function updateTaskDescription(taskId, userId, description){
  // userId = sessionStorage.userId
  // return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'')
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/'+taskId+'?userId='+userId, {
    description: description
  })
  .then(response => {
    return response;
  });
}

export function markHighPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=HIGH')
  .then(response => {
    return response;
  });
}

export function markLowPriority(taskId, userId){
  // userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=LOW')
  .then(response => {
    return response;
  });
}

export function assignOrReassignTask(taskId, assignedByUserId, assignedToUserId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/addOrUpdateTaskAssignment/' + taskId + '?assignedByUserId=' + assignedByUserId + '&assignedToUserId=' + assignedToUserId)
    .then(response => {
    return response;
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
  });
}

export function getTasksAssignedToUserByTaskListId(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUserByTaskListId/' + taskListId + '?complete=false')
  .then(response => {
    return response.data;
  });
}

export function getTasksAssignedByMe(taskListId){
  if(taskListId != undefined){
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser?taskListId=' + taskListId)
    .then(response => {
      return response.data;
    });
  }else{
    return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedByUser')
    .then(response => {
      return response.data;
    });
  }
}

export function getHighPriorityTasksByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findHighPriorityListTasks/'+taskListId+'?startPosition=0')
  .then(response => {
    return response.data;
  });
}

export function getListTasksByPatient(patientId, status, taskListId){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByPatient/'+patientId+'/taskList/'+taskListId+'?status='+status)
  .then(response => {
    return response.data;
  });
}

export function getInboxTasks(status){
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findInboxTasks?status='+status+'&queryStartPosition=0')
  .then(response => {
    return response.data;
  });
}

export function flagUnread(taskId, flagUnread){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/flagUserTaskAsUnread/'+taskId+'?flagUnread='+flagUnread)
  .then(response => {
    return response.data;
  });
}
