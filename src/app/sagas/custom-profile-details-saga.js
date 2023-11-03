import { put, call, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';

function* getCurrentProfileTasks({ profileIdentifier }) {
  try {
    const lists = yield call(
      TaskApi.findTasksByProfileGroupedByTaskList,
      profileIdentifier,
    );

    yield put({
      type: ActionTypes.FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_SUCCESS,
      lists,
    });
  } catch {
    yield put({
      type: ActionTypes.FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_FAILURE,
    });
  }
}

export default function* watchPatientDetails() {
  yield takeLatest(
    ActionTypes.GET_CURRENT_PROFILE_TASKS,
    getCurrentProfileTasks,
  );
}
