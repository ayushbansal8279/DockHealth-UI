import { GET_TASKLIST_SUCCESS } from 'actions/action-types';
import { getTaskListForUser } from 'api/task-list-api';
import { takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import * as TaskListApi from 'api/task-list-api';
import * as ActionTypes from 'actions/action-types';
import { showGlobalErrorAlert } from 'alert/actions';

const DO_FETCH_TASKLIST_FOR_USER = 'DO_FETCH_TASKLIST_FOR_USER';

export const fetchTasklistForUser = () => ({
  type: DO_FETCH_TASKLIST_FOR_USER,
});

function* doFetchTasklistForUser() {
  try {
    const taskLists = yield call(getTaskListForUser);
    yield put({ type: GET_TASKLIST_SUCCESS, taskLists });
  } catch (error) {
    console.error('error', error);
  }
}

function* updateListColumnsDisplaySetup({ payload }) {
  try {
    const { setup, taskListIdentifier } = payload;
    yield call(
      TaskListApi.updateUserColumnsListViewSetup,
      setup,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_LIST_COLUMNS_DISPLAY_SETUP_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_LIST_COLUMNS_DISPLAY_SETUP_FAILURE });
  }
}

function* updateListViewDisplaySetup({ payload }) {
  try {
    const { setup, taskListIdentifier } = payload;
    yield call(
      TaskListApi.updateUserOptionsListViewSetup,
      setup,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_LIST_VIEW_SETUP_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_LIST_VIEW_SETUP_FAILURE });
  }
}

export default function* watchTasklist() {
  yield takeLatest(DO_FETCH_TASKLIST_FOR_USER, doFetchTasklistForUser);
  yield takeEvery(
    ActionTypes.UPDATE_LIST_COLUMNS_DISPLAY_SETUP,
    updateListColumnsDisplaySetup,
  );
  yield takeEvery(
    ActionTypes.UPDATE_LIST_VIEW_SETUP,
    updateListViewDisplaySetup,
  );
}
