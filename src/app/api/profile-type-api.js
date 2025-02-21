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

export function getProfileListPreferences(profileTypeIdentifier) {
  return axios
    .get(`profile/type/list/getUserPreferences/${profileTypeIdentifier}`)
    .then(({data}) => data);
}

export function updateProfileListPreferences(setup, profileTypeIdentifier) {
  return axios
    .put(`profile/type/list/updateUserPreferences/${profileTypeIdentifier}`, setup)
    .then(({ data }) => data);
}