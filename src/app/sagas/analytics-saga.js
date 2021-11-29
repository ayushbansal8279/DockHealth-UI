import { put, call, takeLatest, all } from 'redux-saga/effects';
import * as AnalyticsApi from 'api/analytics-api';
import * as ActionTypes from 'actions/action-types';
import { showGlobalErrorAlert } from '../alert/actions';

function* getAnalyticsFilterOptions() {
  try {
    const filters = yield call(AnalyticsApi.getAnalyticsFilterOptions);
    yield put({
      type: ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_SUCCESS,
      filters,
    });
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({ type: ActionTypes.GET_ANALYTICS_FILTER_OPTIONS_FAILURE }),
    ]);
  }
}

export default function* watchAnalytics() {
  yield takeLatest(
    ActionTypes.GET_ANALYTICS_FILTER_OPTIONS,
    getAnalyticsFilterOptions,
  );
}
