import { blobFileDownload } from '../helpers/blob-file-download';
import { mapFilterOptions } from '../helpers/filter-options-helpers';
import { handleMixedResponse } from '../helpers/handle-mixed-response';
import { noop, showAlert } from '../helpers/utility-functions';
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

export function downloadProfileImportTemplate(profileTypeIdentifier, filename="Profile_Data_Upload_Template.csv") {
  return axios({
    url: `/profile/downloadProfileImportTemplate/${profileTypeIdentifier}`,
    method: 'GET',
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

export function uploadProfileData(fileData, additionalConfig = {}, identifier) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));

  return axios
    .post(`/profile/upload/${identifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then((response) => handleMixedResponse(response))
    .catch((error) => {
      if (error.response && error.response.status === 413) {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'File exceeded the allowed size of 100 MB',
        });
      } else {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.errorMessage ??
            error?.message ??
            'Error in uploading data. Please try again.'
        });
      }
      throw error;
    });
}

export function getPatientForProfile(profileIdentifier) {
  return axios
    .get(`profile/patients/${profileIdentifier}`)
    .then(response => response.data)
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
