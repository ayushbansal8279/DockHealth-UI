import {
  takeEvery,
  put,
  call,
  all,
  delay,
  fork,
  take,
  actionChannel,
} from 'redux-saga/effects';
import pluck from 'ramda/src/pluck';
import move from 'ramda/src/move';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { closeModal } from 'modal/actions';
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
      (t) => t.targetTaskIdentifier === targetTaskIdentifier,
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

function* sendEmailForTask({ communicationDetails }) {
  try {
    yield call(TaskApi.sendMessageForTask, communicationDetails);
    yield put(showGlobalAlert(AlertMessages.MAIL_SENT));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* sendEmrForTask({ emrData }) {
  try {
    yield call(TaskApi.postToEMR, emrData);
    yield put(showGlobalAlert(AlertMessages.EMR_SENT));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* markTaskAsRead(task) {
  try {
    const updatedTask = yield call(
      TaskApi.flagUnread,
      task?.taskIdentifier,
      false,
    );
    yield put({
      type: ActionTypes.MARK_TASK_AS_READ_SUCCESS,
      task: updatedTask,
    });
  } catch {
    yield put({ type: ActionTypes.MARK_TASK_AS_READ_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* markTaskAsUnRead(task) {
  try {
    const updatedTask = yield call(
      TaskApi.flagUnread,
      task?.taskIdentifier,
      true,
    );
    yield put({
      type: ActionTypes.MARK_TASK_AS_UNREAD_SUCCESS,
      task: updatedTask,
    });
  } catch {
    yield put({ type: ActionTypes.MARK_TASK_AS_UNREAD_FAILURE });
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

function* sendESignForTask({ communicationDetails }) {
  try {
    yield call(TaskApi.sendMessageForTask, communicationDetails);
    yield put(showGlobalAlert(AlertMessages.ESIGN_SENT));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* sendSmsForTask({ communicationDetails }) {
  try {
    yield call(TaskApi.sendMessageForTask, communicationDetails);
    yield put(showGlobalAlert(AlertMessages.SMS_SENT));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* sendSecureMessageForTask({ communicationDetails }) {
  try {
    yield call(TaskApi.sendMessageForTask, communicationDetails);
    yield put(showGlobalAlert(AlertMessages.SECURE_MSG_SENT));
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
    yield put({ type: ActionTypes.REFRESH_ORIGIN });
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    yield put({
      type: ActionTypes.UPDATE_TASK_DETAILS_FAILURE,
      task,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskStartDate({ task, startDate, startDateIntent = null }) {
  try {
    const updatedTask = yield call(TaskApi.updateStartDate, task.identifier, startDate, startDateIntent);
    yield put({
      type: ActionTypes.UPDATE_TASK_START_DATE_SUCCESS,
      task,
      startDate: updatedTask.startDate,
      startDateIntent: updatedTask.startDateIntent
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put({
      type: ActionTypes.UPDATE_TASK_START_DATE_FAILURE,
      task,
      startDate: task.startDate,
      startDateIntent: task?.startDateIntent
    });
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskDueDate({ task, dueDate, dueDateIntent = null }) {
  try {
    const updatedTask = yield call(
      TaskApi.updateDueDate,
      task.identifier,
      dueDate,
      dueDateIntent
    );
    yield put({
      type: ActionTypes.UPDATE_TASK_DUE_DATE_SUCCESS,
      task,
      dueDate: updatedTask.dueDate,
      dueDateIntent: updatedTask.dueDateIntent
    });
    yield put({ type: ActionTypes.REFRESH_ORIGIN });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put({
      type: ActionTypes.UPDATE_TASK_DUE_DATE_FAILURE,
      task,
      dueDate: task?.dueDate,
      dueDateIntent: task?.dueDateIntent
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

function* shareTask({
  taskIdentifier,
  userIdentifiers,
  externalUsers,
  message,
  assignTask,
}) {
  try {
    yield call(
      TaskApi.shareTask,
      taskIdentifier,
      userIdentifiers,
      externalUsers,
      message,
      assignTask,
    );

    yield all([
      put({ type: ActionTypes.SHARE_TASK_SUCCESS, taskIdentifier }),
      put(TaskActions.refreshTask(taskIdentifier)),
      put(showGlobalAlert(AlertMessages.SHARED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put({ type: ActionTypes.SHARE_TASK_FAILURE, taskIdentifier }),
      put(TaskActions.refreshTask(taskIdentifier)),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* handleAction(action) {
  try {
    const response = yield call(TaskApi.bulkEditTasks, action.payload);
    if (action.callback) {
      action.callback(null, response);
    }
  } catch (error) {
    if (action.callback) {
      action.callback(error);
    }
  }
}

function* watchActions() {
  const requestChannel = yield actionChannel(ActionTypes.BULK_EDIT_TASKS);

  while (true) {
    const action = yield take(requestChannel);
    yield call(handleAction, action);
  }
}

export default function* watchTask() {
  yield takeEvery(ActionTypes.REORDER_SUBTASKS, reorderSubtasks);
  yield takeEvery(ActionTypes.ADD_TASK_DEPENDENCY_LINK, addTaskDependencyLink);
  yield takeEvery(ActionTypes.DELETE_TASKS_LINK, deleteTasksLink);
  yield takeEvery(ActionTypes.UPDATE_TASKS_LINK, updateTasksLink);
  yield takeEvery(ActionTypes.SEND_FAX_FOR_TASK, sendFaxForTask);
  yield takeEvery(ActionTypes.SEND_ESIGN_FOR_TASK, sendESignForTask);
  yield takeEvery(ActionTypes.SEND_SMS_FOR_TASK, sendSmsForTask);
  yield takeEvery(ActionTypes.SEND_EMAIL_FOR_TASK, sendEmailForTask);
  yield takeEvery(ActionTypes.SEND_EMR_FOR_TASK, sendEmrForTask);
  yield takeEvery(
    ActionTypes.SEND_SECURE_MSG_FOR_TASK,
    sendSecureMessageForTask,
  );

  yield takeEvery(ActionTypes.CHOOSE_DECISION_TASK_OPTION, chooseTaskOutcome);
  yield takeEvery(ActionTypes.REFRESH_TASK_BUNDLE, refreshTemplateBundle);
  yield takeEvery(ActionTypes.CHANGE_TASK_INTENT_TYPE, changeTaskIntentType);
  yield takeEvery(ActionTypes.ADD_TASK, addTask);
  yield takeEvery(ActionTypes.UPDATE_TASK_DESCRIPTION, updateTaskDescription);
  yield takeEvery(ActionTypes.UPDATE_TASK_DETAILS, updateTaskDetails);
  yield takeEvery(ActionTypes.UPDATE_TASK_START_DATE, updateTaskStartDate);
  yield takeEvery(ActionTypes.UPDATE_TASK_DUE_DATE, updateTaskDueDate);
  yield takeEvery(ActionTypes.CHANGE_TASK_PRIORITY, changeTaskPriority);
  yield takeEvery(ActionTypes.REFRESH_TASK, refreshTask);
  yield takeEvery(ActionTypes.INSERT_CREATED_TASK, insertCreatedTask);
  yield takeEvery(ActionTypes.SHARE_TASK, shareTask);
  yield takeEvery(ActionTypes.MARK_TASK_AS_READ, markTaskAsRead);
  yield takeEvery(ActionTypes.MARK_TASK_AS_UNREAD, markTaskAsUnRead);
  yield all([fork(watchActions)]);
}
