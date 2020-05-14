import axios from './axios-heydoc';
import URLS from '../urls';

export const getGroupsByListId = listIdentifier =>
  axios
    .get(URLS.taskGroupList.get(listIdentifier))
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const createGroupAssignedToList = payload =>
  axios
    .post(URLS.taskGroupList.add, payload)
    .then(response => response?.data)
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
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.error);
    });

export const deleteGroup = groupId =>
  axios
    .delete(URLS.taskGroupList.delete(groupId))
    .then(response => response?.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });
