import {
  put,
  call,
  takeEvery,
  takeLatest,
  select,
  all,
} from 'redux-saga/effects';
import * as ProfileApi from 'api/profile-api';
import * as ProfileTypeApi from 'api/profile-type-api';
import * as ActionTypes from '../actions/action-types';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as AlertActions from 'alert/actions';
import {
  currentProfileIdentifierSelector,
  currentProfileTypeIdentifierSelector,
} from '../selectors/profile-selector';
import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { closeModal } from 'modal/actions';

function* getCurrentProfileFilterOptions() {
  try {
    const profileTypeIdentifier = yield select(
      currentProfileTypeIdentifierSelector,
    );

    const filters = yield call(
      ProfileApi.getProfileFilterOptions,
      profileTypeIdentifier,
    );

    yield put({
      type: ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS_SUCCESS,
      filters,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS_FAILURE,
    });
  }
}

function* selectedProfileFilter({ payload }) {
  const { filters, selectedQuickFilter } = payload;
  const profileTypeIdentifier = yield select(
    currentProfileTypeIdentifierSelector,
  );
  const status = '';
  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      filters,
      profileTypeIdentifier,
      status,
      selectedQuickFilter,
    ),
  );
}

function* updateProfileListPreferences({ payload }) {
  try {
    const { setup, profileTypeIdentifier } = payload;
    yield call(
      ProfileTypeApi.updateProfileListPreferences,
      setup,
      profileTypeIdentifier,
    );
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* mergeProfile({ fromProfile, toProfile, onSuccess }) {
  try {
    yield call(ProfileApi.mergeProfile, fromProfile, toProfile);
    onSuccess?.();
  } catch {
    yield all([
      put(AlertActions.showGlobalErrorAlert()),
      put({ type: ActionTypes.MERGE_PROFILE_FAILURE }),
    ]);
  }
}

function* getCurrentProfileAttachments({ folderIdentifier }) {
  const profileIdentifier = yield select(currentProfileIdentifierSelector);

  try {
    const attachments = yield call(
      ProfileApi.getProfileAttachments,
      profileIdentifier,
      folderIdentifier,
    );
    const profileTaskAttachments = yield call(
      ProfileApi.getTaskAndWorkflowAttachmentsForProfile,
      profileIdentifier,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS_SUCCESS,
      attachments,
      profileTaskAttachments,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS_FAILURE,
      profileIdentifier,
    });
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* createProfileAttachment({
  profileIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
}) {
  try {
    const attachment = yield call(
      ProfileApi.createProfileAttachment,
      profileIdentifier,
      folderIdentifier,
      fileData,
      additionalConfig,
    );
    setCurrentlyUploadedAttachment(null);
    onAttachmentFileInputChange(restAttachments);

    yield put({ type: ActionTypes.ADD_PROFILE_ATTACHMENT_SUCCESS, attachment });
  } catch (error) {
    setCurrentlyUploadedAttachment(null);
    onAttachmentFileInputChange(restAttachments);

    yield put({
      type: ActionTypes.ADD_PROFILE_ATTACHMENT_FAILURE,
      profileIdentifier,
      folderIdentifier,
    });

    yield error.response && error.response.status === 413
      ? put(
          AlertActions.showGlobalErrorAlert(
            'File exceeded the allowed size of 100 MB',
          ),
        )
      : put(AlertActions.showGlobalErrorAlert());
  }
}

function* updateProfileAttachment({ attachment, dataToUpdate }) {
  try {
    const updatedAttachment = yield call(ProfileApi.updateProfileAttachment, {
      ...attachment,
      ...dataToUpdate,
    });

    yield all([
      put({
        type: ActionTypes.UPDATE_PROFILE_ATTACHMENT_SUCCESS,
        attachment: updatedAttachment,
      }),
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(closeModal()),
    ]);
  } catch (error) {
    yield all([put(showGlobalErrorAlert())]);
  }
}

export function* createProfileAttachmentFolder({
  profileIdentifier,
  name,
  folderIdentifier,
}) {
  try {
    const folder = yield call(
      ProfileApi.createProfileAttachmentFolder,
      profileIdentifier,
      name,
      folderIdentifier,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.CREATED)),
      put({
        type: ActionTypes.ADD_PROFILE_ATTACHMENT_FOLDER_SUCCESS,
        folder,
      }),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({
        type: ActionTypes.ADD_PROFILE_ATTACHMENT_FOLDER_FAILURE,
        profileIdentifier,
        name,
      }),
    ]);
  }
}

function* moveProfileAttachment({ attachment, destinationFolderIdentifier }) {
  try {
    const updatedAttachment = yield call(ProfileApi.updateProfileAttachment, {
      ...attachment,
      parentAttachmentIdentifier: destinationFolderIdentifier,
    });
    yield all([
      put({
        type: ActionTypes.MOVE_PROFILE_ATTACHMENT_SUCCESS,
        attachment: updatedAttachment,
        destinationFolderIdentifier,
      }),
      put(showGlobalAlert(AlertMessages.MOVED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.MOVE_PROFILE_ATTACHMENT_SUCCESS,
        attachment,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* deleteProfileAttachment({ profileIdentifier, identifier }) {
  try {
    yield call(ProfileApi.deleteProfileAttachment, identifier);
    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put({
        type: ActionTypes.DELETE_PROFILE_ATTACHMENT_SUCCESS,
        profileIdentifier,
        identifier,
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.DELETE_PROFILE_ATTACHMENT_FAILURE,
        profileIdentifier,
        identifier,
      }),
      put(PatientDetailsActions.getCurrentPatient()),
      put(AlertActions.showGlobalErrorAlert()),
    ]);
  }
}

function* profileBulkArchive({
  profileIdentifiers,
  profileTypeIdentifier,
  status,
  profileStatus,
}) {
  try {
    yield call(
      ProfileApi.bulkArchiveProfiles,
      profileIdentifiers,
      profileTypeIdentifier,
      status,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.ARCHIVED)),
      put({
        type: ActionTypes.PROFILE_BULK_ARCHIVE_SUCCESS,
        profileIdentifiers,
        profileTypeIdentifier,
        status,
      }),
      put({
        type: ActionTypes.GET_PROFILES,
        profileTypeIdentifier,
        profileStatus: profileStatus || 'ALL',
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.PROFILE_BULK_ARCHIVE_FAILURE,
        profileIdentifiers,
        profileTypeIdentifier,
        status,
      }),
      put(AlertActions.showGlobalErrorAlert()),
    ]);
  }
}

function* profileBulkDelete({
  profileIdentifiers,
  profileTypeIdentifier,
  profileStatus,
}) {
  try {
    yield call(
      ProfileApi.bulkDeleteProfiles,
      profileIdentifiers,
      profileTypeIdentifier,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put({
        type: ActionTypes.PROFILE_BULK_DELETE_SUCCESS,
        profileIdentifiers,
        profileTypeIdentifier,
      }),
      put({
        type: ActionTypes.GET_PROFILES,
        profileTypeIdentifier,
        profileStatus: profileStatus || 'ALL',
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.PROFILE_BULK_DELETE_FAILURE,
        profileIdentifiers,
        profileTypeIdentifier,
      }),
      put(AlertActions.showGlobalErrorAlert()),
    ]);
  }
}

function* getProfiles({ profileTypeIdentifier, profileStatus }) {
  try {
    const queryType =
      profileStatus === 'ACTIVE'
        ? 'ACTIVE_PROFILES'
        : profileStatus === 'ARCHIVED'
        ? 'ARCHIVED_PROFILES'
        : 'ALL_PROFILES';

    const profiles = yield call(
      ProfileApi.getAllProfiles,
      profileTypeIdentifier,
      queryType,
    );

    yield put({
      type: ActionTypes.GET_PROFILES_SUCCESS,
      profiles,
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_PROFILES_FAILURE,
      error: error.message,
    });
  }
}

function* filterProfiles({ profileTypeIdentifier, filter }) {
  try {
    const filteredProfiles = yield call(
      ProfileApi.getProfileDetailByFilter,
      profileTypeIdentifier,
      filter,
    );

    yield put({
      type: ActionTypes.FILTER_PROFILES_SUCCESS,
      filteredProfiles,
    });
  } catch (error) {
    yield put({
      type: ActionTypes.FILTER_PROFILES_FAILURE,
      error: error.message,
    });
  }
}

function* profileBulkEditCustomFields({
  profileIdentifiers,
  profileTypeIdentifier,
  fields,
  profileStatus,
}) {
  try {
    yield call(ProfileApi.bulkEditProfilesCustomFields, {
      profileIdentifiers,
      profileTypeIdentifier,
      fields,
    });
    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put({
        type: ActionTypes.PROFILE_BULK_EDIT_CUSTOM_FIELDS_SUCCESS,
        profileIdentifiers,
        profileTypeIdentifier,
        fields,
      }),
      put({
        type: ActionTypes.GET_PROFILES,
        profileTypeIdentifier,
        profileStatus: profileStatus || 'ALL',
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.PROFILE_BULK_EDIT_CUSTOM_FIELDS_FAILURE,
        profileIdentifiers,
        profileTypeIdentifier,
        fields,
      }),
      put(AlertActions.showGlobalErrorAlert()),
    ]);
  }
}

export default function* watchProfileDetail() {
  yield takeEvery(
    ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
    getCurrentProfileFilterOptions,
  );
  yield takeLatest(ActionTypes.SELECTED_PROFILE_FILTER, selectedProfileFilter);
  yield takeLatest(
    ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES,
    updateProfileListPreferences,
  );
  yield takeEvery(ActionTypes.MERGE_PROFILE, mergeProfile);
  yield takeLatest(
    ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS,
    getCurrentProfileAttachments,
  );
  yield takeEvery(ActionTypes.ADD_PROFILE_ATTACHMENT, createProfileAttachment);
  yield takeEvery(
    ActionTypes.UPDATE_PROFILE_ATTACHMENT,
    updateProfileAttachment,
  );
  yield takeEvery(ActionTypes.MOVE_PROFILE_ATTACHMENT, moveProfileAttachment);
  yield takeEvery(
    ActionTypes.ADD_PROFILE_ATTACHMENT_FOLDER,
    createProfileAttachmentFolder,
  );
  yield takeEvery(
    ActionTypes.DELETE_PROFILE_ATTACHMENT,
    deleteProfileAttachment,
  );
  yield takeEvery(ActionTypes.PROFILE_BULK_ARCHIVE, profileBulkArchive);
  yield takeEvery(ActionTypes.PROFILE_BULK_DELETE, profileBulkDelete);
  yield takeEvery(ActionTypes.PROFILE_BULK_EDIT_CUSTOM_FIELDS, profileBulkEditCustomFields);
  yield takeEvery(ActionTypes.GET_PROFILES, getProfiles);
  yield takeEvery(ActionTypes.FILTER_PROFILES, filterProfiles);
}
