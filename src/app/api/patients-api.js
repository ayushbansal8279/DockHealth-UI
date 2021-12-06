import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export const getPatientsLists = () =>
  axios.get('patient/list/getAll').then(response => response.data);

export function getPatientsByListId(patientsListIdentifier) {
  return axios
    .get(`patient/list/${patientsListIdentifier}`)
    .then(({ data: { patients } }) => patients);
}

export function getPatientsByFilterCriteria(
  patientsListIdentifier,
  filterOptions,
) {
  return axios
    .post(
      `patient/filter/filterPatientsByCriteria/${patientsListIdentifier}`,
      mapSelectedOptionsToRequestPayload(filterOptions),
    )
    .then(({ data: { patients, patientFilterOptions } }) => ({
      patients,
      options: mapFilterOptions(patientFilterOptions),
    }));
}

export function getPatientsListDetails(identifier) {
  return (
    axios
      .get(`patient/list/${identifier}`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(({ data: { patients, ...restData } }) => restData)
  );
}

export function getPatientsByCriteria(searchCriteria, patientListIdentifier) {
  return axios
    .get(`patient/getPatientsByCriteria`, {
      params: {
        searchCriteria,
        patientListIdentifier,
      },
    })
    .then(response => response.data);
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

export function getPatientsListFilterOptions(patientListIdentifier) {
  return axios
    .get(`patient/filter/filterOptionsForList/${patientListIdentifier}`)
    .then(({ data }) => mapFilterOptions(data));
}
