import { takeEvery, put, call, all, delay } from 'redux-saga/effects';
import { pluck, move } from 'ramda';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';
import * as TaskActions from 'actions/task-actions';
import {
  REORDER_SUBTASKS,
  CHOOSE_DECISION_TASK_OPTION,
  REFRESH_TASK_BUNDLE,
} from 'actions/action-types-saga';
import { getTemplateBundle } from 'api/template-bundle-api';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import { checkIfHasIncompleteTasks } from 'helpers/tasklist-helpers';

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

function* addTaskDependencyLink({ sourceTask, targetTaskIdentifier }) {
  try {
    const link = sourceTask.taskLinks?.find(
      t => t.targetTaskIdentifier === targetTaskIdentifier,
    );
    if (link) {
      yield put(TaskActions.updateTasksLink({ ...link, isDependent: true }));
    } else {
      yield call(
        TaskApi.addTaskDependencyLink,
        sourceTask.identifier,
        targetTaskIdentifier,
        {
          isDependent: true,
        },
      );
      yield all([
        put(showGlobalAlert(AlertMessages.CREATED)),
        put(TaskActions.refreshTask(targetTaskIdentifier)),
        put(TaskActions.refreshTask(sourceTask.identifier)),
      ]);
    }
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTasksLink({ link }) {
  const { sourceTaskIdentifier, targetTaskIdentifier } = link;
  try {
    yield call(TaskApi.updateTasksLink, link);
    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(TaskActions.refreshTask(sourceTaskIdentifier)),
      put(TaskActions.refreshTask(targetTaskIdentifier)),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteTasksLink({ sourceTaskIdentifier, targetTaskIdentifier }) {
  try {
    yield call(
      TaskApi.deleteTasksLink,
      sourceTaskIdentifier,
      targetTaskIdentifier,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put(TaskActions.refreshTask(sourceTaskIdentifier)),
      put(TaskActions.refreshTask(targetTaskIdentifier)),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}
function* refreshTemplateBundle({ templateBundleIdentifier }) {
  try {
    const templateBundle = yield call(
      getTemplateBundle,
      templateBundleIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
      bundleIdentifier: templateBundleIdentifier,
      dataToUpdate: templateBundle,
    });
    if (!checkIfHasIncompleteTasks(templateBundle.tasks)) {
      yield delay(TASK_DISAPPEAR_DELAY);
      yield put(
        TemplateBundleActions.completeTemplateBundle(templateBundleIdentifier),
      );
    }
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* chooseTaskOutcome({
  payload: { taskOutcomeIdentifier, templateBundleIdentifier },
}) {
  try {
    yield call(TaskApi.chooseTaskOutcome, taskOutcomeIdentifier);
    yield call(refreshTemplateBundle, { templateBundleIdentifier });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* changeTaskIntentType({ taskIdentifier, intentType }) {
  try {
    yield call(TaskApi.partialUpdateTask, taskIdentifier, {
      intentType,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put({ type: ActionTypes.CHANGE_TASK_INTENT_TYPE_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.CHANGE_TASK_INTENT_TYPE_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTask() {
  yield takeEvery(REORDER_SUBTASKS, reorderSubtasks);
  yield takeEvery(ActionTypes.ADD_TASK_DEPENDENCY_LINK, addTaskDependencyLink);
  yield takeEvery(ActionTypes.DELETE_TASKS_LINK, deleteTasksLink);
  yield takeEvery(ActionTypes.UPDATE_TASKS_LINK, updateTasksLink);
  yield takeEvery(CHOOSE_DECISION_TASK_OPTION, chooseTaskOutcome);
  yield takeEvery(REFRESH_TASK_BUNDLE, refreshTemplateBundle);
  yield takeEvery(ActionTypes.CHANGE_TASK_INTENT_TYPE, changeTaskIntentType);
}
