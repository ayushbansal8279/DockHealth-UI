import axios from './axios-heydoc';

export function getAllProfiles(identifier) {
  return axios.get(`profile/getAll/${identifier}`).then(({ data }) => data);
}

export function getProfileDetails(identifier) {
  return axios.get(`profile/${identifier}`).then(({ data }) => data);
}

export function createProfile(profile) {
  return axios.post('profile', profile).then(({ data }) => data);
}

export function editProfileType(identifier, profile) {
  return axios.put(`profile/${identifier}`, profile).then(({ data }) => data);
}

export function deleteProfile(identifier) {
  return axios.delete(`profile/${identifier}`).then(({ data }) => data);
}
