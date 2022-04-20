import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

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

export function getListTasksGroupedByTaskGroup(
  taskListIdentifier,
  status = 'INCOMPLETE',
  sortBy,
  startPosition = 0,
  endPosition = 0,
  viewMode,
) {
  return axios
    .get(`task/findListTasksGroupedByTaskGroup/${taskListIdentifier}`, {
      params: {
        status,
        startPosition,
        endPosition,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
        viewMode: viewMode || undefined,
      },
    })
    .then(({ data }) => data.taskGroups);
}

export function getTasksForTaskListByTaskGroup(
  taskListIdentifier,
  taskGroupIdentifier,
  status,
  startPosition = 0,
  endPosition = 0,
  sort,
  viewMode,
) {
  return axios
    .get(
      `/task/findListTasksByTaskGroup/${taskListIdentifier}/${taskGroupIdentifier}`,
      {
        params: {
          status,
          startPosition,
          endPosition,
          sortBy: sort?.key || undefined,
          sortDirection: sort?.order || undefined,
          viewMode: viewMode || undefined,
        },
      },
    )
    .then(({ data }) => data);
}

export function searchTasksByTaskList(taskListIdentifier, searchTerm, status) {
  return axios
    .get(
      `/task/searchTasksByTaskList/${taskListIdentifier}?searchTerm=${searchTerm}&status=${status}`,
    )
    .then(({ data }) => data.taskGroups);
}

export function getFilteredTasksForList(
  taskListIdentifier,
  status = 'INCOMPLETE',
  sortBy,
  selectedFilters,
) {
  return axios
    .post(
      `task/filter/filterSpecificTasksByCriteria/${taskListIdentifier}`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
      {
        params: {
          status,
          sortBy: sortBy?.key || undefined,
          sortDirection: sortBy?.order || undefined,
        },
      },
    )
    .then(({ data }) => data.taskGroups);
}

export function getTaskListFilterOptions(
  taskListIdentifier,
  status,
  selectedFilters,
) {
  let request;
  if (selectedFilters) {
    request = axios
      .post(
        `task/filter/filterSpecificTasksByCriteria/${taskListIdentifier}?includeOptions=true`,
        mapSelectedOptionsToRequestPayload(selectedFilters),
        {
          params: {
            status,
          },
        },
      )
      .then(({ data }) => data.taskFilterOptions);
  } else {
    request = axios
      .get(`task/filter/filterOptionsForTaskList/${taskListIdentifier}`, {
        params: { status },
      })
      .then(({ data }) => data);
  }

  return request.then(responseFilters => mapFilterOptions(responseFilters));
}

export function getTasksForListByDateRange(
  taskListIdentifier,
  status,
  startDate,
  endDate,
) {
  return axios
    .get(`task/findListTasksByDueDateRange/taskList/${taskListIdentifier}`, {
      params: { status, startDate, endDate },
    })
    .then(({ data }) => data);
}
