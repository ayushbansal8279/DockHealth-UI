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
