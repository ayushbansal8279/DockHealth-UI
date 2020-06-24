import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export function getDashboardTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksAssignedToUserGroupedByDueDate?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}
