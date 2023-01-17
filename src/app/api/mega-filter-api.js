/* eslint-disable sonarjs/no-identical-functions */
import {
  mapSelectedOptionsToRequestPayload,
  mapRequestSelectedOptionsToStore,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getQuickFilters(quickFilters) {
  return axios
    .get(`task/quickFilter/search`, {
      params: { ...quickFilters },
    })
    .then(({ data }) => {
      return data.map(f => ({
        ...f,
        selectedOptions: mapRequestSelectedOptionsToStore(f.selectedOptions),
      }));
    });
}
export function createQuickFilter(quickFilters, viewSpecificData) {
  return axios
    .post(`task/quickFilter`, {
      ...quickFilters,
      ...viewSpecificData,
      selectedOptions: mapSelectedOptionsToRequestPayload(
        quickFilters.selectedOptions,
      ),
    })
    .then(({ data }) => {
      return {
        ...data,
        selectedOptions: mapRequestSelectedOptionsToStore(data.selectedOptions),
      };
    });
}
export function updateQuickFilter(quickFilterIdentifier, quickFilters) {
  return axios
    .put(`task/quickFilter`, {
      ...quickFilters,
      quickFilterIdentifier,
      selectedOptions: mapSelectedOptionsToRequestPayload(
        quickFilters.selectedOptions,
      ),
    })
    .then(({ data }) => {
      return {
        ...data,
        selectedOptions: mapRequestSelectedOptionsToStore(data.selectedOptions),
      };
    });
}

export function deleteQuickFilter(identifier) {
  return axios
    .delete(`task/quickFilter/${identifier}`)
    .then(({ data }) => data);
}
