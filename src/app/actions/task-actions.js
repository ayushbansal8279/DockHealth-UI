import * as types from '../actions/action-types';

let nextTaskId = 0

// export const addTask = (text) => {
//   return {
//     type: types.ADD_TASK,
//     id: nextTaskId++,
//     text
//   }
// }

export const addTaskSuccess = (task) => {
  return {
    type: types.ADD_TASK,
    id: nextTaskId++,
    task
  }
}

export function getTasksSuccess(tasks) {
  return {
    type: types.GET_TASKS_SUCCESS,
    tasks
  };
}

export function deleteTaskSuccess(taskId) {
  return {
    type: types.DELETE_TASK_SUCCESS,
    taskId
  };
}

