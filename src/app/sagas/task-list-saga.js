import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { currentTaskListIdentifierSelector } from 'selectors/task-list-selectors';
import { pluck, move } from 'ramda';
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
    if (!payload) {
      return;
    }
    const {
      source: { index: source },
      destination: { index: destination },
      activeLists,
    } = payload;

    if (destination === source || !activeLists || !source || !destination)
      return;

    const taskListIdentifiers = move(source, destination, activeLists);
    const identifiers = pluck('taskListIdentifier', taskListIdentifiers);

    const sortedIdentifiers = { taskListIdentifiers: identifiers };

    yield call(TaskListApi.sortTasksListsForUser, sortedIdentifiers);
    yield put({
      type: ActionTypes.REORDER_TASKLISTS,
    });
    yield put({ type: ActionTypes.REORDER_TASKLISTS_SUCCESS });
  } catch (error) {
    console.log(`error ${error}`);
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.REORDER_TASKLISTS_FAILURE });
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
    ActionTypes.UPDATE_LIST_VIEW_SETUP,
    updateListViewDisplaySetup,
  );
  yield takeEvery(ActionTypes.REORDER_TASKLISTS, reorderTaskLists);
}
