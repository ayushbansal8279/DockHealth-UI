/* eslint-disable import/prefer-default-export */
import axios from './axios-heydoc';

export function getFiltersForTaskListMegaFilter(taskListIdentifier, status) {
  return axios
    .get(`task/filter/filterOptionsForTaskList/${taskListIdentifier}`, {
      params: { status },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
