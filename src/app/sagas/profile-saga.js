import { put, call, takeEvery, takeLatest, select, all } from 'redux-saga/effects';
import * as ProfileApi from 'api/profile-api';
import * as ActionTypes from '../actions/action-types';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as AlertActions from 'alert/actions';
import { currentProfileIdentifierSelector } from '../selectors/profile-selector';

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

export default function* watchProfileDetail() {
  yield takeEvery(
    ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
    getCurrentProfileFilterOptions,
  );
  yield takeLatest(ActionTypes.SELECTED_PROFILE_FILTER, selectedProfileFilter);
  yield takeEvery(ActionTypes.MERGE_PROFILE, mergeProfile);
}
