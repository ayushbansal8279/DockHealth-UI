import { blobFileDownload } from '../helpers/blob-file-download';
import { mapFilterOptions } from '../helpers/filter-options-helpers';
import { handleMixedResponse } from '../helpers/handle-mixed-response';
import {
  getTransformedProfileFields,
  ProfileAttachmentType,
} from '../helpers/profile-helpers';
import { noop, showAlert } from '../helpers/utility-functions';
import axios from './axios-heydoc';

export function getAllProfiles(identifier) {
  return axios.get(`profile/getAll/${identifier}`).then(({ data }) => data);
}

export function getProfileDetails(identifier) {
  return axios.get(`profile/${identifier}`).then(({ data }) => data);
}

export function createProfile(profileTypeIdentifier, details, types) {
  const transformedDetails = getTransformedProfileFields(details, types);
  return axios
    .post('profile', {
      fields: transformedDetails,
      profileType: {
        identifier: profileTypeIdentifier,
      },
    })
    .then(({ data }) => data);
}

export function editProfileDetails(identifier, details, types) {
  const transformedDetails = getTransformedProfileFields(details, types);
  return axios
    .put(`profile/${identifier}`, { fields: transformedDetails })
    .then(({ data }) => data);
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

export function downloadProfileImportTemplate(
  profileTypeIdentifier,
  filename = 'Profile_Data_Upload_Template.csv',
) {
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
            'Error in uploading data. Please try again.',
        });
      }
      throw error;
    });
}

export function getPatientForProfile(profileIdentifier) {
  return axios
    .get(`profile/patients/${profileIdentifier}`)
    .then((response) => response.data);
}

export function getProfileAttachments(profileIdentifier, folderIdentifier) {
  return axios
    .get(
      `profile/attachment/getProfileAttachmentsInFolder/${profileIdentifier}`,
      {
        params: { parentAttachmentIdentifier: folderIdentifier ?? undefined },
      },
    )
    .then((response) => response.data);
}

export function createProfileAttachment(
  profileIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig = {},
) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));
  formData.append('parentAttachmentIdentifier', folderIdentifier ?? undefined);

  return axios
    .post(`profile/attachment/${profileIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then(({ data }) => data);
}

export function updateProfileAttachment(attachment) {
  return axios.put(`profile/attachment`, attachment).then(({ data }) => data);
}

export function createProfileAttachmentFolder(
  profileIdentifier,
  name,
  folderIdentifier,
) {
  return axios
    .post(`profile/attachment/other`, {
      profileIdentifier,
      fileName: name,
      type: ProfileAttachmentType.FOLDER,
      parentAttachmentIdentifier: folderIdentifier ?? undefined,
    })
    .then(({ data }) => data);
}

export function deleteProfileAttachment(identifier) {
  return axios
    .delete(`profile/attachment/${identifier}`)
    .then((response) => response);
}

export function downloadProfileAttachment(attachmentIdentifier) {
  return axios({
    url: `profile/attachment/download/${attachmentIdentifier}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then((response) => response);
}

export function getTaskAndWorkflowAttachmentsForProfile(profileIdentifier) {
  return axios
    .get(
      `task/attachment/getTaskAndWorkflowAttachmentsForProfile/${profileIdentifier}`,
    )
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
