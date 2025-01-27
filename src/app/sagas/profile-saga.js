import {
  put,
  call,
  takeEvery,
  select,
} from 'redux-saga/effects';
import * as ProfileApi from 'api/profile-api';
import * as ActionTypes from '../actions/action-types';
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
    console.log("filters",filters);
    
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

export default function* watchProfileDetail() {
  yield takeEvery(
    ActionTypes.GET_CURRENT_PROFILE_FILTER_OPTIONS,
    getCurrentProfileFilterOptions,
  );
}
