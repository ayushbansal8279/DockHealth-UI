/* eslint-disable sonarjs/no-identical-functions */
import {
  mapSelectedOptionsToRequestPayload,
  mapRequestSelectedOptionsToStore,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getQuickFilters(quickFilters) {
  return axios
    .get(`quickFilter/search`, {
      params: { ...quickFilters },
    })
    .then(({ data }) =>
      data.map((f) => ({
        ...f,
        selectedOptions:
          f.contextType === 'PATIENTS'
            ? mapRequestSelectedOptionsToStore(f.patientSelectedOptions)
            : mapRequestSelectedOptionsToStore(f.selectedOptions),
      })),
    );
}
export function createQuickFilter(quickFilters, viewSpecificData) {
  return axios
    .post(`quickFilter`, {
      ...quickFilters,
      ...viewSpecificData,
      selectedOptions:
        viewSpecificData?.contextType === 'PATIENTS'
          ? {}
          : mapSelectedOptionsToRequestPayload(quickFilters.selectedOptions),
      patientSelectedOptions:
        viewSpecificData?.contextType === 'PATIENTS'
          ? mapSelectedOptionsToRequestPayload(quickFilters.selectedOptions)
          : {},
    })
    .then(({ data }) => ({
      ...data,
      selectedOptions: mapRequestSelectedOptionsToStore(data.selectedOptions),
    }));
}
export function updateQuickFilter(
  quickFilterIdentifier,
  quickFilters,
  viewSpecificData,
) {
  return axios
    .put(`quickFilter`, {
      ...quickFilters,
      quickFilterIdentifier,
      selectedOptions:
        viewSpecificData?.contextType === 'PATIENTS'
          ? {}
          : mapSelectedOptionsToRequestPayload(quickFilters.selectedOptions),
      patientSelectedOptions:
        viewSpecificData?.contextType === 'PATIENTS'
          ? mapSelectedOptionsToRequestPayload(quickFilters.selectedOptions)
          : {},
    })
    .then(({ data }) => ({
      ...data,
      selectedOptions: mapRequestSelectedOptionsToStore(data.selectedOptions),
    }));
}

export function deleteQuickFilter(identifier) {
  return axios.delete(`quickFilter/${identifier}`).then(({ data }) => data);
}
