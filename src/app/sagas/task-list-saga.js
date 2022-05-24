import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { currentTaskListIdentifierSelector } from 'selectors/task-list-selectors';
import * as TaskListApi from 'api/task-list-api';
import * as ActionTypes from 'actions/action-types';
import * as TaskListActions from 'actions/task-list-actions';
import { showGlobalErrorAlert } from 'alert/actions';

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

function* updateListColumnsOrderSetup({ payload }) {
  try {
    const { setup, taskListIdentifier } = payload;
    yield call(
      TaskListApi.updateUserCustomFieldsOptionsListViewSetup,
      setup,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_ORDER_COLUMNS_SETUP_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_ORDER_COLUMNS_SETUP_FAILURE });
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
  yield takeEvery(
    ActionTypes.UPDATE_LIST_COLUMNS_DISPLAY_SETUP,
    updateListColumnsDisplaySetup,
  );
  yield takeEvery(
    ActionTypes.UPDATE_ORDER_COLUMNS_SETUP,
    updateListColumnsOrderSetup,
  );
  yield takeEvery(
    ActionTypes.UPDATE_LIST_VIEW_SETUP,
    updateListViewDisplaySetup,
  );
}
