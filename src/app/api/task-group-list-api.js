import axios from './axios-heydoc';

export const TASKGROUP_DEFAULT_TYPE = 'TASKLIST_DEFAULT';

export const getGroupsByListId = (listIdentifier, status = 'INCOMPLETE') =>
  axios
    .get(
      `task/stats/getTaskStatsForListTaskGroups/${listIdentifier}?status=${status}`,
    )
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });

export const createGroupAssignedToList = (payload) =>
  axios
    .post(`task/group`, payload)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });

export const editGroupName = (
  taskListIdentifier,
  taskGroupIdentifier,
  groupName,
) =>
  axios
    .put(`task/group`, {
      taskListIdentifier,
      taskGroupIdentifier,
      groupName,
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.error);
    });

export const deleteGroup = (groupId) =>
  axios
    .delete(`task/group/${groupId}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });

export const sortGroups = (payload) =>
  axios
    .put(`task/group/sortTaskGroups`, payload)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });

export function getGroupsForTaskList(taskListIdentifier) {
  return axios
    .get(`/task/group/getGroupsForTaskList/${taskListIdentifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}
