import axios from 'axios';
import store from '../store';
import * as ActionTypes from '../actions/action-types';
//import { getTasksSuccess, deleteTaskSuccess, addTaskSuccess } from '../actions/task-actions';

/**
 * Get all tasks for a user
 */
export function getTasks() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task/findTasksCreatedByUser/1?organizationId=1')
    .then(response => {
      store.dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks: response.data});
      return response;
    });
  /*
  var data = [{taskId:1, description:"Task 1", status:"delivered"}, {taskId:2, description:"Task 2", status:"read"}];
  store.dispatch(getTasksSuccess(data));
  */
}

/**
 * Search tasks
 */
export function searchTasks(query = '') {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'task?q='+ query)
    .then(response => {
      store.dispatch({type: ActionTypes.GET_TASKS_SUCCESS, tasks: response.data});
      return response;
    });
}

export function deleteTask(taskId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'task/' + taskId)
    .then(response => {
      store.dispatch({type: ActionTypes.DELETE_TASK_SUCCESS, taskId: taskId});
      return response;
    });
}

export function addTask(task) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response;
    });
    
    //var data = {id:101, text:"Added Task 1"};
    //var data = task;
    //store.dispatch(addTaskSuccess(data));
}

export function updateTask(task) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'task', task)
    .then(response => {
      //store.dispatch({type: ActionTypes.ADD_TASK, id: nextTaskId++, task: response.data});
      store.dispatch({type: ActionTypes.ADD_TASK, task: response.data});
      return response;
    });
    
    //var data = {id:101, text:"Added Task 1"};
    //var data = task;
    //store.dispatch(addTaskSuccess(data));
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