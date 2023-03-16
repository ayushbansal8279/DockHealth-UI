import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import { showGlobalErrorAlert } from 'alert/actions';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import * as ActionTypes from 'actions/action-types';
import * as CustomFieldsApi from 'api/custom-fields-api';
import * as TaskDrawerActions from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';

function* getTaskCustomFields({ taskIdentifier, taskListIdentifier }) {
  try {
    const customFieldsList = yield call(
      CustomFieldsApi.getAllTaskCustomFields,
      taskIdentifier,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.GET_TASK_CUSTOM_FIELDS_SUCCESS,
      customFieldsList,
      taskIdentifier,
    });
  } catch {
    yield put({ type: ActionTypes.GET_TASK_CUSTOM_FIELDS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* openDrawer() {
  const isTaskDrawerOpen = yield select(taskDrawerOpenSelector);
  if (isTaskDrawerOpen) {
    yield all([
      put(TaskDrawerActions.closeDrawer()),
      put(storeAsCurrentTask()),
    ]);
  }
}

export default function* watchTaskDrawer() {
  yield takeEvery(ActionTypes.GET_TASK_CUSTOM_FIELDS, getTaskCustomFields);
  yield takeEvery(ActionTypes.OPEN_WORKFLOW_DRAWER, openDrawer);
}
