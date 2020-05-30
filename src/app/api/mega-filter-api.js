/* eslint-disable import/prefer-default-export */
import axios from './axios-heydoc';
import URLS from '../urls';

export function getFiltersForMegaFilter(taskListIdentifier) {
  return axios
    .get(URLS.megaFilter.getFilters(taskListIdentifier))
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
