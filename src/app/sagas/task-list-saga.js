import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { GET_TASKLIST_SUCCESS } from 'actions/action-types';
import { getTaskListForUser } from 'api/task-list-api';
import { currentTaskListIdentifierSelector } from 'selectors/task-list-selectors';
import * as TaskListApi from 'api/task-list-api';
import * as ActionTypes from 'actions/action-types';
import * as TaskListActions from 'actions/task-list-actions';
import { showGlobalErrorAlert } from 'alert/actions';

const DO_FETCH_TASKLIST_FOR_USER = 'DO_FETCH_TASKLIST_FOR_USER';

export const fetchTasklistForUser = () => ({
  type: DO_FETCH_TASKLIST_FOR_USER,
});

function* initializeTaskListState() {
  yield put(TaskListActions.getCurrentTaskList());
}

function* getCurrentTaskList() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const taskList = yield call(
      TaskListApi.getTaskListById,
      taskListIdentifier,
    );
    yield put({ type: ActionTypes.GET_CURRENT_TASK_LIST_SUCCESS, taskList });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_CURRENT_TASK_LIST_FAILURE });
  }
}

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
  yield takeLatest(
    ActionTypes.INITIALIZE_TASK_LIST_STATE,
    initializeTaskListState,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_TASK_LIST, getCurrentTaskList);
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
