/* eslint-disable import/prefer-default-export */
import axios from './axios-heydoc';

export function deleteQuickFilter(data) {
  return axios
    .delete(`placeholder-url`, {
      data,
    })
    .then(({ d }) => d);
}

export function updateQuickFilter(data) {
  return axios
    .put(`placeholder-url`, {
      data,
    })
    .then(({ d }) => d);
}
