/* eslint-disable import/prefer-default-export */
import axios from './axios-heydoc';
import URLS from '../urls';

export function getFiltersForTaskListMegaFilter(taskListIdentifier, status) {
  return axios
    .get(URLS.megaFilter.getFiltersForTaskList(taskListIdentifier, status))
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getFiltersForPeopleListMegaFilter(userId, status) {
  return axios
    .get(URLS.megaFilter.getFiltersForPeopleList(userId, status))
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
