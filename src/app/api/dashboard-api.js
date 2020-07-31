import axios from './axios-heydoc';

export function getDashboardMyTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksAssignedToUserGroupedByDueDate?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function getDashboardAllTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksForOrganizationGroupedByDueDate?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export function reorderTasksInGroup({
  tasksOrder: orderedTaskIds,
  taskGroupImplicitType,
}) {
  return axios
    .put('task/sortTasksInImplicitTaskGroup', {
      taskIdentifiers: orderedTaskIds,
      taskGroupImplicitType,
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}
