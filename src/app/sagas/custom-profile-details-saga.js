import { put, call, takeLatest } from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';
import { updateTaskInStore } from '../actions/custom-profile-details-action';

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

function* updateProfileTaskInList({ payload }) {
  const { taskIdentifier, updatedTaskData } = payload;
  try {
    yield call(TaskApi.partialUpdateTask, taskIdentifier, updatedTaskData);
    yield put(updateTaskInStore(taskIdentifier, updatedTaskData));
    // yield put(getTasksForProfile(profileIdentifier));
  } catch {
    // yield put(getTasksForProfile(profileIdentifier));
  }
}

export default function* watchPatientDetails() {
  yield takeLatest(
    ActionTypes.GET_CURRENT_PROFILE_TASKS,
    getCurrentProfileTasks,
  );
  yield takeLatest(
    ActionTypes.UPDATE_PROFILE_TASK_IN_LIST, 
    updateProfileTaskInList
  );
}
