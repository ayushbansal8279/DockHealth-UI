import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import { TaskStatus } from 'helpers/task-helpers';
import axios from './axios-heydoc';

const includeCustomFieldsPatientsToEachTask = (data) => {
  const { taskGroups } = data;
  const updatedTaskGroups = taskGroups.map((g) => ({
    ...g,
    tasks: (g?.tasks || []).map((t) => {
      const patient = (g.patients || []).find(
        (p) => p?.patientIdentifier === t?.patient?.patientIdentifier,
      );
      const task = {
        ...t,
      };
      if (t?.patient) {
        task.patient.patientMetaData = patient?.patientMetaData || [];
      }
      return task;
    }),
  }));
  return { ...data, taskGroups: updatedTaskGroups };
};

export function getDashboardMyTasks(status = 'INCOMPLETE') {
  return axios
    .get(`/task/findTasksAssignedToUserGroupedByDueDate?status=${status}`)
    .then((response) => response.data)
    .catch((error) => {
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
    .catch((error) => {
      throw error;
    });
}

export function getDashboardMyTasksFilters() {
  const request = axios
    .get(`task/filter/filterOptionsForCurrentUser?status=INCOMPLETE`)
    .then(({ data }) => data);

  return request.then((options) => mapFilterOptions(options));
}

export function getDashboardAllTasksFilters() {
  const request = axios
    .get(`task/filter/filterOptionsForTasksInOrganization?status=INCOMPLETE`)
    .then(({ data }) => data);

  return request.then((options) => mapFilterOptions(options));
}

export const getDashboardMyTasksByCriteria = (selectedFilters) =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForCurrentUser?status=INCOMPLETE`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(
      ({ data }) => includeCustomFieldsPatientsToEachTask(data)?.taskGroups,
    );

export const getDashboardAllTasksByCriteria = (selectedFilters) =>
  axios
    .post(
      `task/filter/filterTasksByCriteriaForOrganization?status=INCOMPLETE`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
    )
    .then(({ data }) => data.taskGroups);

export function getTasksAssignedToUserByImplicitGroup(
  groupType,
  sortBy,
  sortDirection,
  startPosition = 0,
  endPosition = 0,
) {
  return axios
    .get(`/task/findTasksAssignedToUserByImplicitGroup`, {
      params:
        sortBy && sortDirection
          ? {
              groupType,
              startPosition,
              endPosition,
              status: 'INCOMPLETE',
              sortBy,
              sortDirection,
            }
          : { groupType, startPosition, endPosition, status: 'INCOMPLETE' },
    })
    .then(({ data }) => includeCustomFieldsPatientsToEachTask(data))
    .catch((error) => {
      throw error;
    });
}

export function getTasksForOrganizationByImplicitGroup(
  groupType,
  sortBy,
  sortDirection,
  startPosition = 0,
  endPosition = 0,
) {
  return axios
    .get(`/task/findTasksForOrganizationByImplicitGroup`, {
      params:
        sortBy && sortDirection
          ? {
              groupType,
              startPosition,
              endPosition,
              status: 'INCOMPLETE',
              sortBy,
              sortDirection,
            }
          : { groupType, startPosition, endPosition, status: 'INCOMPLETE' },
    })
    .then(({ data }) => includeCustomFieldsPatientsToEachTask(data))
    .catch((error) => {
      throw error;
    });
}

export function getDashboardTaskStasForImplicitGroups(tab) {
  return axios
    .get(
      `/task/stats/getTaskStatsForImplicitGroupsForCurrentUser?viewName=${tab}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchTasksByAssignedToUserGroupedByImplicitGroups(searchTerm) {
  return axios
    .get(
      `/task/searchTasksByAssignedToUserGroupedByImplicitGroups?searchTerm=${searchTerm}&status=INCOMPLETE`,
    )
    .then(
      ({ data }) =>
        includeCustomFieldsPatientsToEachTask({ taskGroups: data })?.taskGroups,
    )
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchTasksForOrganizationGroupedByImplicitGroups(searchTerm) {
  return axios
    .get(
      `/task/searchTasksForOrganizationGroupedByImplicitGroups?searchTerm=${searchTerm}&status=INCOMPLETE`,
    )
    .then(
      ({ data }) =>
        includeCustomFieldsPatientsToEachTask({ taskGroups: data })?.taskGroups,
    )
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getCalendarTasks(viewName, startDate, endDate) {
  return axios
    .get(`/task/findTasksForViewByDueDateRange`, {
      params: { viewName, status: TaskStatus.INCOMPLETE, startDate, endDate },
    })
    .then(({ data }) => data);
}
