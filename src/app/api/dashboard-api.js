import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getDashboardMyTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksAssignedToUserGroupedByDueDate?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getDashboardAllTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksForOrganizationGroupedByDueDate?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
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

export function getDashboardMyTasksFilters(selectedFilters) {
  const request = !selectedFilters
    ? axios
        .get(`task/filter/filterOptionsForCurrentUser?status=INCOMPLETE`)
        .then(({ data }) => data)
    : axios
        .post(
          `task/filter/filterTasksByCriteriaForCurrentUser?status=INCOMPLETE&includeOptions=true`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
        )
        .then(({ data }) => data.taskFilterOptions);

  return request.then(options => mapFilterOptions(options));
}

export function getDashboardAllTasksFilters(selectedFilters) {
  const request = !selectedFilters
    ? axios
        .get(
          `task/filter/filterOptionsForTasksInOrganization?status=INCOMPLETE`,
        )
        .then(({ data }) => data)
    : axios
        .post(
          `task/filter/filterTasksByCriteriaForOrganization?status=INCOMPLETE&includeOptions=true`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
        )
        .then(({ data }) => data.taskFilterOptions);

  return request.then(options => mapFilterOptions(options));
}

export const getDashboardMyTasksByCriteria = selectedFilters =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForCurrentUser?status=INCOMPLETE`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(({ data }) => data.taskGroups);

export const getDashboardAllTasksByCriteria = selectedFilters =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForOrganization?status=INCOMPLETE`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(({ data }) => data.taskGroups);

export function getTasksAssignedToUserByImplicitGroup(
  groupType,
  startPosition = 0,
  endPosition = 0,
) {
  return axios
    .get(`/task/findTasksAssignedToUserByImplicitGroup`, {
      params: { groupType, startPosition, endPosition, status: 'INCOMPLETE' },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getTasksForOrganizationByImplicitGroup(
  groupType,
  startPosition = 0,
  endPosition = 0,
) {
  return axios
    .get(
      `/task/findTasksForOrganizationByImplicitGroup?groupType=${groupType}&startPosition=${startPosition}&endPosition=${endPosition}&status=INCOMPLETE`,
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getDashboardTaskStasForImplicitGroups(tab) {
  return axios
    .get(
      `/task/stats/getTaskStatsForImplicitGroupsForCurrentUser?viewName=${tab}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchTasksByAssignedToUserGroupedByImplicitGroups(searchTerm) {
  return axios
    .get(
      `/task/searchTasksByAssignedToUserGroupedByImplicitGroups?searchTerm=${searchTerm}&status=INCOMPLETE`,
    )
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchTasksForOrganizationGroupedByImplicitGroups(searchTerm) {
  return axios
    .get(
      `/task/searchTasksForOrganizationGroupedByImplicitGroups?searchTerm=${searchTerm}&status=INCOMPLETE`,
    )
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}
