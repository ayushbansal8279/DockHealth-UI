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

export default {
  fetchPatientTasksByPatientIdentifier,
};
