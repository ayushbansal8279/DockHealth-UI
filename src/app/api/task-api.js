import axios from 'axios';
import configureStore from '../configureStore';
import * as ActionTypes from '../actions/action-types';
//import { getTasksSuccess, deleteTaskSuccess, addTaskSuccess } from '../actions/task-actions';

const store = configureStore();

/**
 * Get all tasks for a user
 */
export function getTasksForCreator(userId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksCreatedByUser/'+userId+'?organizationId=1')
    .then(response => {
      // store.dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks: response.data});
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
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      // store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response.data;
    });
}

export function updateTask(task) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task'+'?userId='+userId, task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      // store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response.data;
    });
}

export function deleteTask(taskId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/' + taskId + '?deleterId=' + userId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response;
    });
}

export function markComplete(taskId, userId){
  console.log(taskId);
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + taskId + '?userId=' + userId + '&status=COMPLETE')
  .then(response => {
    return response;
  });
}

export function markIncomplete(taskId, userId){
  console.log(taskId);
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'task/updateTaskStatus/' + taskId + '?userId=' + userId + '&status=INCOMPLETE')
  .then(response => {
    return response;
  });
}

export function addComment(task) {
  /*
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response;
    });
  */  
    //var data = {id:101, text:"Added Task 1"};
    //var data = task;
    //store.dispatch(addTaskSuccess(data));
}