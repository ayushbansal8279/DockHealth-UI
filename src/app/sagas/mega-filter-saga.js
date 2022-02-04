import { takeEvery, put, call, all, delay } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as MegaFilterApi from 'api/mega-filter-api';

function* createQuickFilter({ taskIdentifier }) {
  try {
    yield call(MegaFilterApi.updateQuickFilter, taskIdentifier);
    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_FAILURE });
  }
}
function* updateQuickFilter({ taskIdentifier }) {
  try {
    yield call(MegaFilterApi.updateQuickFilter, taskIdentifier);
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_FAILURE });
  }
}

function* deleteQuickFilter({ taskIdentifier }) {
  try {
    yield call(MegaFilterApi.deleteQuickFilter, taskIdentifier);
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_FAILURE });
  }
}

export default function* watchTask() {
  yield takeEvery(ActionTypes.CREATE_QUICK_FILTER, createQuickFilter);
  yield takeEvery(ActionTypes.UPDATE_QUICK_FILTER, updateQuickFilter);
  yield takeEvery(ActionTypes.DELETE_QUICK_FILTER, deleteQuickFilter);
}
