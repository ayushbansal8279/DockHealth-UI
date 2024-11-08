import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { currentTaskListIdentifierSelector } from 'selectors/task-list-selectors';
import pluck from 'ramda/src/pluck';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as TaskListApi from 'api/task-list-api';
import * as ActionTypes from 'actions/action-types';
import * as TaskListActions from 'actions/task-list-actions';

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

function* updateListPreferences({ payload }) {
  try {
    const { setup, taskListIdentifier } = payload;
    yield call(TaskListApi.updateListPreferences, setup, taskListIdentifier);
    yield put({
      type: ActionTypes.UPDATE_LIST_PREFERENCES_SUCCESS,
    });
    yield put(TaskListActions.getCurrentTaskList());
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_LIST_PREFERENCES_FAILURE });
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

function* reorderTaskLists({ payload }) {
  try {
    if (!payload) return;

    const { activeLists } = payload;
    const identifiers = pluck('taskListIdentifier', activeLists);

    yield call(TaskListApi.sortTasksListsForUser, identifiers);
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTasklist() {
  yield takeLatest(
    ActionTypes.INITIALIZE_TASK_LIST_STATE,
    initializeTaskListState,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_TASK_LIST, getCurrentTaskList);
  yield takeEvery(
    ActionTypes.UPDATE_LIST_VIEW_SETUP,
    updateListViewDisplaySetup,
  );
  yield takeEvery(ActionTypes.REORDER_TASKLISTS, reorderTaskLists);
  yield takeEvery(ActionTypes.UPDATE_LIST_PREFERENCES, updateListPreferences);
}
