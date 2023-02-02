import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function fetchPatientTasksByPatientIdentifier(
  patientIdentifier,
  sortBy,
  status = 'INCOMPLETE',
) {
  return axios
    .get(`/task/findTasksByPatientGroupedByTaskList/${patientIdentifier}`, {
      params: {
        status: status === 'ALL' ? undefined : status,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
      },
    })
    .then(({ data }) => data);
}

export function fetchPatientTasksByPatientIdentifierWithFilters(
  patientIdentifier,
  sortBy,
  selectedFilters,
  status = 'INCOMPLETE',
) {
  return axios
    .post(
      `/task/filter/filterTasksByCriteriaForPatient/${patientIdentifier}`,
      mapSelectedOptionsToRequestPayload(selectedFilters),
      {
        params: {
          status: status === 'ALL' ? undefined : status,
          sortBy: sortBy?.key || undefined,
          sortDirection: sortBy?.order || undefined,
        },
      },
    )
    .then(({ data }) => data.taskLists);
}

export function getPatientTasksStats(patientIdentifier) {
  return axios
    .get(`/task/stats/getTaskStatsForPatient/${patientIdentifier}`)
    .then(({ data }) => data);
}

export function getPatientFilters(
  patientIdentifier,
  status = 'INCOMPLETE',
  selectedFilters,
) {
  const request = selectedFilters
    ? axios
        .post(
          `/task/filter/filterTasksByCriteriaForPatient/${patientIdentifier}?includeOptions=true`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
          {
            params: {
              status: status === 'ALL' ? undefined : status,
            },
          },
        )
        .then(({ data }) => data.taskFilterOptions)
    : axios
        .get(`task/filter/filterOptionsForPatient/${patientIdentifier}`, {
          params: {
            status: status === 'ALL' ? undefined : status,
          },
        })
        .then(({ data }) => data);

  return request.then((options) => mapFilterOptions(options));
}
