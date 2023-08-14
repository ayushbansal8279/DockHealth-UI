import axios from './axios-heydoc';

export function getAllProfileFieldTypes(identifier) {
  return axios
    .get(`profile/type/field/getAll/${identifier}`)
    .then(({ data }) => data);
}

export function getProfileFieldTypeDetails(identifier) {
  return axios.get(`profile/type/field/${identifier}`).then(({ data }) => data);
}

export function createProfileFieldType(profileType) {
  return axios.post('profile/type/field', profileType).then(({ data }) => data);
}

export function editProfileFieldType(identifier, profileType) {
  return axios
    .put(`profile/type/field/${identifier}`, profileType)
    .then(({ data }) => data);
}

export function deleteProfileFieldType(identifier) {
  return axios
    .delete(`profile/type/field/${identifier}`)
    .then(({ data }) => data);
}
