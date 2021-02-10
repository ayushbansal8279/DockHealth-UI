import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export function getTaskStatsForList(taskListIdentifier) {
  return axios
    .get(`/task/stats/getTaskStatsForList/${taskListIdentifier}`)
    .then(resp => {
      return resp?.data;
    })
    .catch(error => {
      throw error;
    });
}
