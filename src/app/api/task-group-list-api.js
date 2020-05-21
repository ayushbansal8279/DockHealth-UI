import axios from './axios-heydoc';
import URLS from '../urls';

export const TASKGROUP_DEFAULT_TYPE = 'TASKLIST_DEFAULT';

export const getGroupsByListId = listIdentifier =>
  axios
    .get(URLS.taskGroupList.get(listIdentifier))
    .then(({ data }) => data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const createGroupAssignedToList = payload =>
  axios
    .post(URLS.taskGroupList.add, payload)
    .then(({ data }) => data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const editGroupName = (
  taskListIdentifier,
  taskGroupIdentifier,
  groupName,
) =>
  axios
    .put(URLS.taskGroupList.edit, {
      taskListIdentifier,
      taskGroupIdentifier,
      groupName,
    })
    .then(({ data }) => data)
    .catch(error => {
      throw new Error(error?.response?.error);
    });

export const deleteGroup = groupId =>
  axios
    .delete(URLS.taskGroupList.delete(groupId))
    .then(({ data }) => data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const sortGroups = payload =>
  axios
    .put(URLS.taskGroupList.sort, payload)
    .then(({ data }) => data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export function reassignTasksToAnotherGroup(
  taskGroupIdentifier,
  taskIdentifiers,
) {
  return axios
    .put(URLS.taskGroupList.reassignTasks(taskGroupIdentifier), {
      taskIdentifiers,
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
