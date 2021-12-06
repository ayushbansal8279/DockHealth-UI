import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export const fetchPatientTasksByPatientIdentifier = (
  patientIdentifier,
  sortBy,
  status = 'INCOMPLETE',
) =>
  axios
    .get(`/task/findTasksByPatientGroupedByTaskList/${patientIdentifier}`, {
      params: {
        status: status === 'ALL' ? undefined : status,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const fetchPatientTasksByPatientIdentifierWithFilters = (
  patientIdentifier,
  sortBy,
  selectedFilters,
  status = 'INCOMPLETE',
) =>
  axios
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
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const getPatientTasksStats = patientIdentifier =>
  axios
    .get(`/task/stats/getTaskStatsForPatient/${patientIdentifier}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const getPatientFilters = (patientIdentifier, status = 'INCOMPLETE') =>
  axios
    .get(`task/filter/filterOptionsForPatient/${patientIdentifier}`, {
      params: {
        status: status === 'ALL' ? undefined : status,
      },
    })
    .then(({ data }) => mapFilterOptions(data))
    .catch(error => {
      throw error;
    });
