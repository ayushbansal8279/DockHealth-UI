import { put, call, takeEvery, takeLatest, select, all } from 'redux-saga/effects';
import * as ProfileApi from 'api/profile-api';
import * as ProfileTypeApi from 'api/profile-type-api'
import * as ActionTypes from '../actions/action-types';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as AlertActions from 'alert/actions';
import { currentProfileIdentifierSelector, currentProfileTypeIdentifierSelector } from '../selectors/profile-selector';
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
  const profileTypeIdentifier = yield select(currentProfileTypeIdentifierSelector);
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
    yield call(
      ProfileApi.mergeProfile,
      fromProfile,
      toProfile,
    );
    onSuccess?.();
  } catch {
    yield all([
      put(AlertActions.showGlobalErrorAlert()),
      put({ type: ActionTypes.MERGE_PROFILE_FAILURE }),
    ]);
  }
}

function* getCurrentProfileAttachments() {
  const profileIdentifier = yield select(currentProfileIdentifierSelector);
  // const folderIdentifier = yield select(currentFolderIdentifierSelector);
  try {
    const attachments = yield call(
      ProfileApi.getProfileAttachments,
      profileIdentifier,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS_SUCCESS,
      attachments,
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
  fileData,
  additionalConfig,
}) {
  try {
    const attachment = yield call(
      ProfileApi.createProfileAttachment,
      profileIdentifier,
      fileData,
      additionalConfig,
    );
    // setCurrentlyUploadedAttachment(null);
    // onAttachmentFileInputChange(restAttachments);
    yield put({ type: ActionTypes.ADD_PROFILE_ATTACHMENT_SUCCESS, attachment });
  } catch (error) {
    // setCurrentlyUploadedAttachment(null);
    // onAttachmentFileInputChange(restAttachments);

    yield put({
      type: ActionTypes.ADD_PROFILE_ATTACHMENT_FAILURE,
      profileIdentifier,
      // folderIdentifier,
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
    const updatedAttachment = yield call(
      ProfileApi.updateProfileAttachment,
      {
        ...attachment,
        ...dataToUpdate,
      },
    );

    yield all([
      put({
        type: ActionTypes.UPDATE_PROFILE_ATTACHMENT_SUCCESS,
        attachment: updatedAttachment,
      }),
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(closeModal()),
    ]);

  } catch (error) {
    yield all([
      put(showGlobalErrorAlert()),
    ]);
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
    const updatedAttachment = yield call(
      ProfileApi.updateProfileAttachment,
      {
        ...attachment,
        parentAttachmentIdentifier: destinationFolderIdentifier,
      },
    );
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

export default function* watchProfileDetail() {
  yield takeEvery(
    ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
    getCurrentProfileFilterOptions,
  );
  yield takeLatest(ActionTypes.SELECTED_PROFILE_FILTER, selectedProfileFilter);
  yield takeLatest(ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES, updateProfileListPreferences);
  yield takeEvery(ActionTypes.MERGE_PROFILE, mergeProfile);
  yield takeLatest(
    ActionTypes.GET_CURRENT_PROFILE_ATTACHMENTS,
    getCurrentProfileAttachments,
  );
  yield takeEvery(
    ActionTypes.ADD_PROFILE_ATTACHMENT,
    createProfileAttachment,
  );
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
}
