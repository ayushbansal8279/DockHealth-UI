import { takeEvery, put, call } from 'redux-saga/effects';
import { pluck, move } from 'ramda';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';
import {
  ADD_TASK_HARD_DEPENDENCY,
  REORDER_SUBTASKS,
} from 'actions/action-types-saga';
import { addTaskDependency } from 'api/task-api';
import { refreshTask } from 'actions/task-actions';

function* reorderSubtasks(payload) {
  const {
    source: { index: sourceIndex },
    destination: { index: destinationIndex },
    parentTask,
  } = payload;

  if (
    destinationIndex === sourceIndex ||
    !parentTask ||
    !parentTask.subtasks ||
    parentTask.subtasks < 2
  )
    return;

  const reorderedSubtasks = move(
    sourceIndex,
    destinationIndex,
    parentTask.subtasks,
  );

  try {
    yield put({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: {
        ...parentTask,
        subtasks: reorderedSubtasks,
      },
    });

    yield call(
      TaskApi.reorderSubtasks,
      parentTask.taskIdentifier,
      pluck('taskIdentifier', reorderedSubtasks),
    );
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: parentTask,
    });
  }
}

function* addTaskHardDependency({
  sourceTaskIdentifier,
  targetTaskIdentifier,
}) {
  try {
    yield call(addTaskDependency, sourceTaskIdentifier, targetTaskIdentifier, {
      isDependent: true,
    });
    yield put(refreshTask(targetTaskIdentifier));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTask() {
  yield takeEvery(REORDER_SUBTASKS, reorderSubtasks);
  yield takeEvery(ADD_TASK_HARD_DEPENDENCY, addTaskHardDependency);
}
