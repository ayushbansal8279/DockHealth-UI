import { takeEvery, put, call, select } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as MegaFilterApi from 'api/mega-filter-api';
import { quickFiltersSelector } from 'selectors/mega-filter-selectors';

function* getQuickFilters({ viewSpecificData }) {
  try {
    const quickFilters = yield call(
      MegaFilterApi.getQuickFilters,
      viewSpecificData,
    );
    yield put({ type: ActionTypes.GET_QUICK_FILTERS_SUCCESS, quickFilters });
  } catch {
    yield put({ type: ActionTypes.GET_QUICK_FILTERS_FAILURE });
  }
}

function* createQuickFilter({
  name: newName,
  viewSpecificData,
  selectedOptions,
}) {
  try {
    const filter = yield call(
      MegaFilterApi.createQuickFilter,
      { name: newName, selectedOptions },
      viewSpecificData,
    );

    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_SUCCESS, filter });
  } catch (error) {
    console.log('error', error);
    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_FAILURE });
  }
}

function* updateQuickFilter({
  quickFilterIdentifier,
  dataToUpdate,
  viewSpecificData,
}) {
  try {
    const quickFilters = yield select(quickFiltersSelector);
    const editedOption = quickFilters.find(
      option => option.quickFilterIdentifier === quickFilterIdentifier,
    );
    const updatedOption = { ...editedOption, ...dataToUpdate };
    yield call(
      MegaFilterApi.updateQuickFilter,
      quickFilterIdentifier,
      updatedOption,
      viewSpecificData,
    );
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_SUCCESS });
  } catch (error) {
    console.log('error', error);
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_FAILURE });
  }
}

function* deleteQuickFilter({ quickFilterIdentifier }) {
  try {
    yield call(MegaFilterApi.deleteQuickFilter, quickFilterIdentifier);
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_SUCCESS });
  } catch (error) {
    console.log('error', error);
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_FAILURE });
  }
}

export default function* watchMegaFilter() {
  yield takeEvery(ActionTypes.GET_QUICK_FILTERS, getQuickFilters);
  yield takeEvery(ActionTypes.CREATE_QUICK_FILTER, createQuickFilter);
  yield takeEvery(ActionTypes.UPDATE_QUICK_FILTER, updateQuickFilter);
  yield takeEvery(ActionTypes.DELETE_QUICK_FILTER, deleteQuickFilter);
}
