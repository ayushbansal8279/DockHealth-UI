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
      selectedFilters,
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

export const fetchStatsForPatientTasks = patientIdentifier =>
  axios
    .get(`/task/stats/getTaskStatsForPatient/${patientIdentifier}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const fetchPatientFilters = (patientIdentifier, status = 'INCOMPLETE') =>
  axios
    .get(`/task/filter/filterOptionsForPatient/${patientIdentifier}`, {
      params: {
        status: status === 'ALL' ? undefined : status,
      },
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
