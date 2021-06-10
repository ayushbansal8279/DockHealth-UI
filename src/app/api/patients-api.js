import axios from './axios-heydoc';

export const getPatientsLists = () =>
  axios
    .get('patient/list/getAll')
    .then(response => response.data)
    .catch(error => console.log(error));

export function getPatientsList(identifier) {
  return axios.get(`patient/list/${identifier}`).then(({ data }) => data);
}

export function createPatientsList(patientList) {
  return axios.post(`patient/list`, patientList).then(({ data }) => data);
}

export function updatePatientsList(identifier, patientListData) {
  return axios
    .patch(`patient/list`, {
      patientListIdentifier: identifier,
      ...patientListData,
    })
    .then(({ data }) => data);
}

export function deletePatientsList(identifier) {
  return axios.delete(`patient/list/${identifier}`);
}
