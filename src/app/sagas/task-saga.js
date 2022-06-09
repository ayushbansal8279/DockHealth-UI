import { takeEvery, put, call, all, delay } from 'redux-saga/effects';
import { pluck, move } from 'ramda';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as TaskApi from 'api/task-api';
import * as TaskActions from 'actions/task-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
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
    yield put({ type: ActionTypes.REORDER_SUBTASKS_SUCCESS });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.REORDER_SUBTASKS_FAILURE });
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

function* sendEmailForTask(task) {
  try {
    yield call(TaskApi.sendMessageForTask, task);
    yield put(showGlobalAlert(AlertMessages.MAIL_SENT));
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
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS,
      bundleIdentifier: templateBundleIdentifier,
      dataToUpdate: templateBundle,
    });
    yield put(
      ListDetailsActions.getListDetailsTaskCounters(
        templateBundle.taskListIdentifier,
      ),
    );
    yield put(ListDetailsActions.getTasksGroupsList());
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

function* sendFaxForTask({ communicationDetails }) {
  try {
    yield call(TaskApi.sendMessageForTask, communicationDetails);
    yield put(showGlobalAlert(AlertMessages.FAX_SENT));
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

function* addTask({ task }) {
  try {
    const addedTask = yield call(TaskApi.addTask, task);
    yield put({ type: ActionTypes.ADD_TASK_SUCCESS, task: addedTask });
    yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDescription({ task, descriptionState }) {
  const { tokenizedDescription } = descriptionState;
  try {
    const updatedTask = yield call(TaskApi.partialUpdateTask, task.identifier, {
      description: tokenizedDescription,
    });
    yield put({
      type: ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS,
      task: updatedTask,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put({
      type: ActionTypes.UPDATE_TASK_DESCRIPTION_FAILURE,
      task,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDetails({ task, detailsState }) {
  const { tokenizedDetails } = detailsState;
  try {
    const updatedTask = yield call(TaskApi.partialUpdateTask, task.identifier, {
      details: tokenizedDetails,
    });
    yield put({
      type: ActionTypes.UPDATE_TASK_DETAILS_SUCCESS,
      task: updatedTask,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put({
      type: ActionTypes.UPDATE_TASK_DETAILS_FAILURE,
      task,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDueDate({ task, dueDate }) {
  try {
    const updatedTask = yield call(
      TaskApi.updateDueDate,
      task.identifier,
      dueDate,
    );
    yield put({
      type: ActionTypes.UPDATE_TASK_DUE_DATE_SUCCESS,
      task,
      dueDate: updatedTask.dueDate,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put({
      type: ActionTypes.UPDATE_TASK_DUE_DATE_FAILURE,
      task,
      dueDate: task.dueDate,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* changeTaskPriority({ task, priority }) {
  try {
    const response = yield call(
      TaskApi.partialUpdateTask,
      task.taskIdentifier,
      {
        priority,
      },
    );
    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put({
        type: ActionTypes.CHANGE_TASK_PRIORITY_SUCCESS,
        task: response,
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.CHANGE_TASK_PRIORITY_FAILURE,
        task,
        priority: task.priority,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* refreshTask({ taskIdentifier }) {
  try {
    const task = yield call(TaskApi.getTaskDetails, taskIdentifier);

    yield put({ type: ActionTypes.REFRESH_TASK_SUCCESS, task });
  } catch {
    yield put({ type: ActionTypes.REFRESH_TASK_FAILURE });
  }
}

function* insertCreatedTask({ taskIdentifier }) {
  try {
    const task = yield call(TaskApi.getTaskDetails, taskIdentifier);

    yield put({ type: ActionTypes.INSERT_CREATED_TASK_SUCCESS, task });
  } catch {
    yield put({ type: ActionTypes.INSERT_CREATED_TASK_FAILURE });
  }
}

export default function* watchTask() {
  yield takeEvery(ActionTypes.REORDER_SUBTASKS, reorderSubtasks);
  yield takeEvery(ActionTypes.ADD_TASK_DEPENDENCY_LINK, addTaskDependencyLink);
  yield takeEvery(ActionTypes.DELETE_TASKS_LINK, deleteTasksLink);
  yield takeEvery(ActionTypes.UPDATE_TASKS_LINK, updateTasksLink);
  yield takeEvery(ActionTypes.SEND_FAX_FOR_TASK, sendFaxForTask);
  yield takeEvery(ActionTypes.SEND_EMAIL_FOR_TASK, sendEmailForTask);
  yield takeEvery(ActionTypes.CHOOSE_DECISION_TASK_OPTION, chooseTaskOutcome);
  yield takeEvery(ActionTypes.REFRESH_TASK_BUNDLE, refreshTemplateBundle);
  yield takeEvery(ActionTypes.CHANGE_TASK_INTENT_TYPE, changeTaskIntentType);
  yield takeEvery(ActionTypes.ADD_TASK, addTask);
  yield takeEvery(ActionTypes.UPDATE_TASK_DESCRIPTION, updateTaskDescription);
  yield takeEvery(ActionTypes.UPDATE_TASK_DETAILS, updateTaskDetails);
  yield takeEvery(ActionTypes.UPDATE_TASK_DUE_DATE, updateTaskDueDate);
  yield takeEvery(ActionTypes.CHANGE_TASK_PRIORITY, changeTaskPriority);
  yield takeEvery(ActionTypes.REFRESH_TASK, refreshTask);
  yield takeEvery(ActionTypes.INSERT_CREATED_TASK, insertCreatedTask);
}
