import axios from './axios-heydoc';
import { showAlert } from '../helpers/utility-functions';

export function getAllProfileTypes() {
  return axios.get('profile/type/getAll').then(({ data }) => data);
}

export function getProfileDetailsType(identifier) {
  return axios.get(`profile/type/${identifier}`).then(({ data }) => data);
}

export function createProfileType(profile) {
  return axios
    .post('profile/type', profile)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error creating profile type',
      });
    });
}

export function editProfileType(identifier, profile) {
  return axios
    .put(`profile/type/${identifier}`, profile)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error updating profile type',
      });
    });
}

export function deleteProfileType(identifier) {
  return axios
    .delete(`profile/type/${identifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error.response?.data?.errorMessage ?? 'Error deleting profile type',
      });
    });
}
