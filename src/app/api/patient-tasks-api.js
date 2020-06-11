import axios from './axios-heydoc';

export const fetchPatientTasksByPatientIdentifier = (
  patientIdentifier,
  status = 'INCOMPLETE',
) =>
  axios
    .get(
      `/task/findTasksByPatientGroupedByTaskList/${patientIdentifier}?status=${status}`,
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export const fetchPatientTasksByPatientIdentifierWithFilters = (
  patientIdentifier,
  selectedFilters,
  status = 'INCOMPLETE',
) =>
  axios
    .post(
      `/task/filter/filterTasksByCriteriaForPatient/${patientIdentifier}?status=${status}`,
      selectedFilters,
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
    .get(
      `/task/filter/filterOptionsForPatient/${patientIdentifier}?status=${status}`,
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
