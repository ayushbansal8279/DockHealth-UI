import { blobFileDownload } from '../helpers/blob-file-download';
import { mapFilterOptions } from '../helpers/filter-options-helpers';
import { noop } from '../helpers/utility-functions';
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

export function editProfileDetails(identifier, profile) {
  return axios.put(`profile/${identifier}`, profile).then(({ data }) => data);
}

export function deleteProfile(identifier) {
  return axios.delete(`profile/${identifier}`).then(({ data }) => data);
}

export function getProfileFilterOptions(profileTypeIdentifier) {
  return axios
    .get(`/profile/filter/filterOptions/${profileTypeIdentifier}`)
    .then(({ data }) => mapFilterOptions(data));
}

export function getProfileDetailByFilter(profileTypeIdentifier, filter) {
  return axios
    .post(`/profile/filter/filterByCriteria/${profileTypeIdentifier}`, filter)
    .then(({ data }) => data);
}

export function downloadProfileData(profileTypeIdentifier, filename) {
  return axios({
    url: `/profile/list/download/${profileTypeIdentifier}`,
    method: 'POST',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
    .then((response) => {
      blobFileDownload(new Blob([response.data]), filename);
    })
    .catch(noop);
}

export function mergeProfile(profileIdentifier, mergeToProfileIdentifier) {
  return axios
    .patch(`profile/mergeProfile/${profileIdentifier}`, {
      mergeToProfileIdentifier: mergeToProfileIdentifier,
    })
    .then(({ data }) => data);
}

export const note = {
  getAll(profileIdentifier) {
    return axios
      .get(`/profile/note/getAll/${profileIdentifier}`)
      .then(({ data }) => data);
  },
  getById(profileNoteIdentifier) {
    return axios
      .get(`/profile/note/${profileNoteIdentifier}`)
      .then(({ data }) => data);
  },
  create(profileIdentifier, note) {
    return axios
      .post(`/profile/note/${profileIdentifier}`, note)
      .then(({ data }) => data);
  },
  update(profileNoteIdentifier, note) {
    return axios
      .put(`/profile/note/${profileNoteIdentifier}`, note)
      .then(({ data }) => data);
  },
  delete(profileNoteIdentifier) {
    return axios
      .delete(`/profile/note/${profileNoteIdentifier}`)
      .then(({ data }) => data);
  },
};
