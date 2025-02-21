import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';
import * as ProfileApi from 'api/profile-api';
import * as ProfileTypeApi from 'api/profile-type-api'
import * as ActionTypes from '../actions/action-types';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import { currentProfileIdentifierSelector } from '../selectors/profile-selector';
import { showGlobalErrorAlert } from '../alert/actions';

function* getCurrentProfileFilterOptions() {
  try {
    const profileTypeIdentifier = yield select(
      currentProfileIdentifierSelector,
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

  const profileTypeIdentifier = yield select(currentProfileIdentifierSelector);
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
    yield put({
      type: ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES_SUCCESS,
      setup
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES_FAILURE });
  }
}

export default function* watchProfileDetail() {
  yield takeEvery(
    ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
    getCurrentProfileFilterOptions,
  );
  yield takeLatest(ActionTypes.SELECTED_PROFILE_FILTER, selectedProfileFilter);
  yield takeLatest(ActionTypes.UPDATE_PROFILE_LIST_PREFERENCES, updateProfileListPreferences);
}
