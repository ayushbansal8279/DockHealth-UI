import { takeEvery, put, call } from 'redux-saga/effects';
import { pluck, move } from 'ramda';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';
import {
  REORDER_SUBTASKS,
  REORDER_TASKS_IN_TEMPLATE_BUNDLE,
} from 'actions/action-types-saga';

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

function* reorderTasksInTemplateBundle(payload) {
  const {
    source: { index: sourceIndex },
    destination: { index: destinationIndex },
    templateBundle,
  } = payload;

  try {
    const reorderedTasks = move(
      sourceIndex,
      destinationIndex,
      templateBundle.tasks,
    );

    yield put({
      type: ActionTypes.LOAD_TASKS_FOR_BUNDLE,
      tasks: reorderedTasks,
      bundleIdentifier: templateBundle.identifier,
    });

    yield call(TaskApi.reorderTasksInGroup, {
      orderedTaskIds: pluck('identifier', reorderedTasks),
      taskGroupIdentifier: templateBundle.identifier,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.LOAD_TASKS_FOR_BUNDLE,
      tasks: templateBundle.tasks,
      bundleIdentifier: templateBundle.identifier,
    });
  }
}

export default function* watchTask() {
  yield takeEvery(REORDER_SUBTASKS, reorderSubtasks);
  yield takeEvery(
    REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    reorderTasksInTemplateBundle,
  );
}
