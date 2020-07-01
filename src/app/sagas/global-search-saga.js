import { takeEvery, select, put, debounce, call } from 'redux-saga/effects';
import {
  isSearchingCompletedTasksSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import * as GlobalSearchActions from 'actions/global-search-actions';
import * as TaskApi from 'api/task-api';

const DO_SEARCH_TASKS = 'DO_SEARCH_TASKS';
const DO_SET_SEARCH_COMPLETED_TASKS = 'DO_SET_SEARCH_COMPLETED_TASKS';
const DO_SET_SEARCH_VALUE = 'DO_SET_SEARCH_VALUE';

export const searchTasks = () => ({
  type: DO_SEARCH_TASKS,
});

export const setSearchValue = value => ({
  type: DO_SET_SEARCH_VALUE,
  payload: { value },
});

export const setSearchCompletedTasks = isSearchingCompletedTasks => ({
  type: DO_SET_SEARCH_COMPLETED_TASKS,
  payload: { isSearchingCompletedTasks },
});

function* doSearchTasks() {
  try {
    yield put(GlobalSearchActions.requestGlobalSearch());
    const isSearchingCompletedTasks = yield select(
      isSearchingCompletedTasksSelector,
    );
    const searchValue = yield select(searchValueSelector);

    const status = isSearchingCompletedTasks ? 'COMPLETE' : 'INCOMPLETE';
    const response = yield call(TaskApi.searchTasks, searchValue, status);
    yield put(GlobalSearchActions.requestGlobalSearchSuccess(response));
  } catch (error) {
    yield put(GlobalSearchActions.requestGlobalSearchFailure());
    console.error('error', error);
  }
}

function* doSetSearchValue({ payload }) {
  const { value } = payload;

  yield put(GlobalSearchActions.setSearchValue(value));
  yield put(searchTasks());
}

function* doSetSearchCompletedTasks({ payload }) {
  const { isSearchingCompletedTasks } = payload;

  if (isSearchingCompletedTasks) {
    yield put(GlobalSearchActions.searchCompletedTasks());
  } else {
    yield put(GlobalSearchActions.searchIncompletedTasks());
  }

  yield put(searchTasks());
}

export default function* watchGlobalSearch() {
  yield debounce(250, DO_SET_SEARCH_VALUE, doSetSearchValue);
  yield takeEvery(DO_SEARCH_TASKS, doSearchTasks);
  yield takeEvery(DO_SET_SEARCH_COMPLETED_TASKS, doSetSearchCompletedTasks);
}
