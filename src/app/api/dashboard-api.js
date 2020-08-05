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

export function getDashboardMyTasksFilters(status = 'INCOMPLETE') {
  return axios
    .get(`task/filter/filterOptionsForCurrentUser?status=${status}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getDashboardAllTasksFilters(status = 'INCOMPLETE') {
  return axios
    .get(`task/filter/filterOptionsForTasksInOrganization?status=${status}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export const getDashboardMyTasksByCriteria = (
  selectedFilters,
  status = 'INCOMPLETE',
) =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForCurrentUser?status=${status}`,
      selectedFilters,
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const getDashboardAllTasksByCriteria = (
  selectedFilters,
  status = 'INCOMPLETE',
) =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForOrganization?status=${status}`,
      selectedFilters,
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export function getDashboardStatistics(tab) {
  return axios
    .get(`task/stats/getTaskStatsForCurrentUser?viewName=${tab}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}
