import { takeEvery, put, call, all, delay, select } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as MegaFilterApi from 'api/mega-filter-api';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { currentTaskListSelector } from 'selectors/task-list-selectors';
import { currentPatientIdentifierSelector } from 'selectors/patient-details-selectors';

function* getQuickFilters({ viewSpecificData }) {
  try {
    console.log('viewSpecificData', viewSpecificData);

    // const {quickFilters} = yield call(MegaFilterApi.getQuickFilters, viewSpecificData);
    const quickFilters = [
      // TODO!: TEMPORARY MOCKUP!!!
      // {
      //   displayValue: 'My private filter',
      //   key: 'test-identifier-00001',
      //   filters: {
      //     assignedTo: {
      //       options: ['UNASSIGNED'],
      //     },
      //     patients: {
      //       options: ['421d0711-e564-4381-8243-b624a6a25b8c'],
      //     },
      //     priorityOptions: {
      //       options: ['LOW'],
      //     },
      //   },
      // },
      // {
      //   displayValue: 'Custom Filter 1',
      //   key: 'test-identifier-00002',
      //   filters: {
      //     assignedTo: {
      //       options: ['UNASSIGNED'],
      //     },
      //     patients: {
      //       options: ['421d0711-e564-4381-8243-b624a6a25b8c'],
      //     },
      //   },
      // },
      // {
      //   displayValue: 'My handy filter',
      //   key: 'test-identifier-00003',
      //   filters: {
      //     assignedTo: {
      //       options: ['UNASSIGNED'],
      //     },
      //   },
      // },
    ]; // TODO!: TEMPORARY MOCKUP!!!

    yield put({ type: ActionTypes.GET_QUICK_FILTERS_SUCCESS, quickFilters });
  } catch {
    yield put({ type: ActionTypes.GET_QUICK_FILTERS_FAILURE });
  }
}

function* createQuickFilter({ name, viewSpecificData, selectedFilters }) {
  try {
    // const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    console.log('name', name);
    console.log('selectedFilters', selectedFilters);
    console.log('viewSpecificData', viewSpecificData);

    // const { identifier } = yield call(MegaFilterApi.createQuickFilter, {
    //   name,
    //   viewSpecificData,
    // });

    const filter = {
      displayValue: name,
      key: Math.random(),
      filters: selectedFilters,
    };
    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_SUCCESS, filter });
  } catch {
    yield put({ type: ActionTypes.CREATE_QUICK_FILTER_FAILURE });
  }
}

function* updateQuickFilter({ identifier, dataToUpdate, viewSpecificData }) {
  try {
    console.log('viewSpecificData', viewSpecificData);

    // yield call(MegaFilterApi.updateQuickFilter, identifier, dataToUpdate, viewSpecificData);
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.UPDATE_QUICK_FILTER_FAILURE });
  }
}

function* deleteQuickFilter({ identifier }) {
  try {
    // yield call(MegaFilterApi.deleteQuickFilter, identifier);
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.DELETE_QUICK_FILTER_FAILURE });
  }
}

export default function* watchMegaFilter() {
  yield takeEvery(ActionTypes.GET_QUICK_FILTERS, getQuickFilters);
  yield takeEvery(ActionTypes.CREATE_QUICK_FILTER, createQuickFilter);
  yield takeEvery(ActionTypes.UPDATE_QUICK_FILTER, updateQuickFilter);
  yield takeEvery(ActionTypes.DELETE_QUICK_FILTER, deleteQuickFilter);
}
