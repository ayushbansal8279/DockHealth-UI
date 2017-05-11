import axios from 'axios';
import configureStore from '../configureStore';
import * as ActionTypes from '../actions/action-types';
//import { getTasksSuccess, deleteTaskSuccess, addTaskSuccess } from '../actions/task-actions';

/**
 * Get all tasks for a user
 */
export function getTasksForCreator(userId) {
  userId = sessionStorage.userId
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksCreatedByUser/'+userId+'?organizationId=1')
    .then(response => {
      // store.dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks: response.data});
      return response.data;
    });
}

export function getListTasksByUser(userId, taskListId){
  //axios.defaults.headers.common['Authorization'] = 'Bearer '.concat(sessionStorage.accessToken)
  userId = sessionStorage.userId
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findListTasksByUser/1?status=INCOMPLETE&queryStartPosition=0')
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
  userId = sessionStorage.userId
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/deleteTaskById/' + taskId + '?deleterId=' + userId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response;
    });
}

export function markComplete(taskId, userId){
  userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + taskId + '?userId=' + userId + '&status=COMPLETE')
  .then(response => {
    return response;
  });
}

export function markIncomplete(taskId, userId){
  userId = sessionStorage.userId
  // console.log(taskId);
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + taskId + '?userId=' + userId + '&status=INCOMPLETE')
  .then(response => {
    return response;
  });
}

export function updateTaskDescription(taskId, userId, description){
  userId = sessionStorage.userId
  // return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'')
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/'+taskId+'?userId='+userId, {
    description: description
  })
  .then(response => {
    return response;
  });
}

export function markHighPriority(taskId, userId){
  userId = sessionStorage.userId
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task/changePriority/' + taskId + '?userId=' + userId + '&priorityLevel=HIGH')
  .then(response => {
    return response;
  });
}

export function markLowPriority(taskId, userId){
  userId = sessionStorage.userId
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
  taskComment.creator.userId = sessionStorage.userId
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task/comment/'+ taskId, taskComment)
    .then(response => {
      return response;
    });
}

export function getTasksAssignedToUserByTaskListId(taskListId, userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksAssignedToUserByTaskListId/' + taskListId + '?complete=false')
    .then(response => {
      return response.data;
    });
}

export function getHighPriorityTasksByTaskList(taskListId, userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findHighPriorityUserTasks/1')
    .then(response => {
      return response.data;
    });
}
