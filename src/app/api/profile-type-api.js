import axios from './axios-heydoc';

export function getAllProfileTypes() {
  return axios.get('profile/type/getAll').then(({ data }) => data);
}

export function getProfileDetailsType(identifier) {
  return axios.get(`profile/type/${identifier}`).then(({ data }) => data);
}

export function createProfileType(profile) {
  return axios.post('profile/type', profile).then(({ data }) => data);
}

export function editProfileType(identifier, profile) {
  return axios
    .put(`profile/type/${identifier}`, profile)
    .then(({ data }) => data);
}

export function deleteProfileType(identifier) {
  return axios.delete(`profile/type/${identifier}`).then(({ data }) => data);
}
