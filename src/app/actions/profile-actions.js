import * as ActionTypes from './action-types';

export function initializeProfileTypeState(profileTypeIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PROFILE_TYPE_STATE,
    profileTypeIdentifier,
  };
}

export function initializeProfileState(profileIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PROFILE_STATE,
    profileIdentifier,
  };
}

export function getProfileFilterOptions() {
  return {
    type: ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
  };
}

export function selectedProfileFilters(filters, selectedQuickFilter) {
  return {
    type: ActionTypes.SELECTED_PROFILE_FILTER,
    payload: {
      filters,
      selectedQuickFilter,
    },
  };
}

export function updateProfileListPreferences(setup, profileTypeIdentifier) {
  return {
    type: ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES,
    payload: { setup, profileTypeIdentifier }
  }
};

export function mergeProfile(fromProfile, toProfile, onSuccess) {
  return {
    type: ActionTypes.MERGE_PROFILE,
    fromProfile,
    toProfile,
    onSuccess
  };
}

export function getCurrentProfileAttachments() {
  return {
    type: ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS,
  };
}

export function updateProfileAttachment(attachment, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_PROFILE_ATTACHMENT,
    attachment,
    dataToUpdate,
  };
}

export const createProfileAttachment = (
  profileIdentifier,
  // folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
) => ({
  type: ActionTypes.ADD_PROFILE_ATTACHMENT,
  profileIdentifier,
  // folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
});

export function moveProfileAttachment(attachment, destinationFolderIdentifier) {
  return {
    type: ActionTypes.MOVE_PROFILE_ATTACHMENT,
    attachment,
    destinationFolderIdentifier,
  };
}

export function createProfileAttachmentFolder(
  profileIdentifier,
  name,
  folderIdentifier = null,
) {
  return {
    type: ActionTypes.ADD_PROFILE_ATTACHMENT_FOLDER,
    profileIdentifier,
    name,
    folderIdentifier,
  };
}

export function deleteProfileAttachment(profileIdentifier, identifier) {
  return {
    type: ActionTypes.DELETE_PROFILE_ATTACHMENT,
    profileIdentifier,
    identifier,
  };
}

