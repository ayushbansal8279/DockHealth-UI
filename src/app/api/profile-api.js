import { blobFileDownload } from '../helpers/blob-file-download';
import { mapFilterOptions } from '../helpers/filter-options-helpers';
import { handleMixedResponse } from '../helpers/handle-mixed-response';
import {
  getTransformedProfileFields,
  ProfileAttachmentType,
  ProfileQueryType,
} from '../helpers/profile-helpers';
import { noop, showAlert } from '../helpers/utility-functions';
import axios from './axios-heydoc';

export function getAllProfiles(
  identifier,
  status = ProfileQueryType.ALL_PROFILES,
) {
  const url = `profile/getAll/${identifier}`;
  const params = status !== ProfileQueryType.ALL_PROFILES ? { status } : {};
  return axios.get(url, { params }).then(({ data }) => data);
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

export function archiveProfile(identifier, status) {
  return axios
    .patch(`profile/archiveProfile/${identifier}`, null, {
      params: { status },
    })
    .then(({ data }) => data);
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

export function getProfileFolderStructureHierarchy(identifier) {
  return axios
    .get(`profile/attachment/${identifier}`, {
      params: { parentDetails: true },
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

export const getProfileRelationships = (
  profileIdentifier,
  relationshipProfileTypeIdentifier,
) => {
  return axios
    .get(
      `profile/${profileIdentifier}/relationships/${relationshipProfileTypeIdentifier}`,
    )
    .then(({ data }) => data);
};

export const ProfileBulkActions = {
  ARCHIVE_PROFILE: 'ARCHIVE_PROFILE',
  DELETE_PROFILE: 'DELETE_PROFILE',
  EDIT_FIELDS: 'EDIT_FIELDS',
  UNARCHIVE_PROFILE: 'UNARCHIVE_PROFILE',
  RESTORE_PROFILE: 'RESTORE_PROFILE',
};

export function bulkArchiveProfiles(
  profileIdentifiers,
  profileTypeIdentifier,
  status,
) {
  const body = {
    bulkOperationType: ProfileBulkActions.ARCHIVE_PROFILE,
    profileIdentifiers,
    status,
  };

  return axios
    .put(`profile/bulkEdit/${profileTypeIdentifier}`, body)
    .then(({ data }) => data);
}

export function bulkDeleteProfiles(profileIdentifiers, profileTypeIdentifier) {
  const body = {
    bulkOperationType: ProfileBulkActions.DELETE_PROFILE,
    profileIdentifiers,
  };

  return axios
    .put(`profile/bulkEdit/${profileTypeIdentifier}`, body)
    .then(({ data }) => data);
}

export function bulkEditProfilesCustomFields(payload) {
  const { fields, profileIdentifiers, profileTypeIdentifier } = payload;
  const body = {
    bulkOperationType: ProfileBulkActions.EDIT_FIELDS,
    profileIdentifiers,
    fields,
  };

  return axios
    .put(`profile/bulkEdit/${profileTypeIdentifier}`, body)
    .then(({ data }) => data);
}

export function bulkUnarchiveProfiles(
  profileIdentifiers,
  profileTypeIdentifier,
  status,
) {
  const body = {
    bulkOperationType: ProfileBulkActions.UNARCHIVE_PROFILE,
    profileIdentifiers,
    status,
  };

  return axios
    .put(`profile/bulkEdit/${profileTypeIdentifier}`, body)
    .then(({ data }) => data);
}

export function bulkRestoreProfiles(profileIdentifiers, profileTypeIdentifier) {
  const body = {
    bulkOperationType: ProfileBulkActions.RESTORE_PROFILE,
    profileIdentifiers,
  };

  return axios
    .put(`profile/bulkEdit/${profileTypeIdentifier}`, body)
    .then(({ data }) => data);
}