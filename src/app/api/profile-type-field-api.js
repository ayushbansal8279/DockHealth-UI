import axios from './axios-heydoc';
import { handleApiError } from '../helpers/api-helpers';

export function getAllProfileFieldTypes(identifier, includeHidden = false) {
  return axios
    .get(`profile/type/field/getAll/${identifier}`, {
      params: { includeHidden },
    })
    .then(({ data }) => data);
}

export function getProfileFieldTypeDetails(identifier) {
  return axios.get(`profile/type/field/${identifier}`).then(({ data }) => data);
}

export function createProfileFieldType(profileType) {
  return axios
    .post('profile/type/field', profileType)
    .then(({ data }) => data)
    .catch((error) => {handleApiError(error)});
}

export function editProfileFieldType(identifier, profileType) {
  return axios
    .put(`profile/type/field/${identifier}`, profileType)
    .then(({ data }) => data)
    .catch((error) => {handleApiError(error)});
}

export function deleteProfileFieldType(identifier) {
  return axios
    .delete(`profile/type/field/${identifier}`)
    .then(({ data }) => data)
    .catch((error) => {handleApiError(error)});
}
