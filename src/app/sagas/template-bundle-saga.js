import { pluck, move } from 'ramda';
import * as ActionTypes from 'actions/action-types';
import AlertMessages from 'alert/AlertMessages';
import * as TemplateBundleApi from 'api/template-bundle-api';
import * as WorkflowApi from 'api/workflow-api';
import { call, put, takeEvery } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { TaskStatus } from 'helpers/task-helpers';
import { applyTemplate as applyTemplateAction } from 'actions/template-bundle-actions';
import { openModal } from 'modal/actions';
import store from '../store';

const ERROR_TYPES = {
  ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST:
    'TASK_TEMPLATE/ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST',
};

function* reorderTasksInTemplateBundle(payload) {
  const {
    source: { index: sourceIndex },
    destination: { index: destinationIndex },
    bundle,
    completedTasksShown,
    incompleteTasksShown,
  } = payload;

  try {
    let reorderedTasks;

    if (completedTasksShown && incompleteTasksShown) {
      reorderedTasks = move(sourceIndex, destinationIndex, bundle.tasks);
    } else {
      const [openedTasks, completedTasks] = bundle.tasks.reduce(
        (accumulator, task) =>
          task.status === TaskStatus.INCOMPLETE
            ? [[...accumulator[0], task], [...accumulator[1]]]
            : [[...accumulator[0]], [...accumulator[1], task]],
        [[], []],
      );

      if ((!completedTasksShown, incompleteTasksShown)) {
        reorderedTasks = move(
          sourceIndex,
          destinationIndex,
          openedTasks,
        ).concat(completedTasks);
      } else if ((completedTasksShown, !incompleteTasksShown)) {
        reorderedTasks = move(
          sourceIndex,
          destinationIndex,
          completedTasks,
        ).concat(openedTasks);
      }
    }

    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS,
      dataToUpdate: { tasks: reorderedTasks },
      bundleIdentifier: bundle.identifier,
    });

    yield call(
      TemplateBundleApi.reorderTasksInBundle,
      bundle.identifier,
      pluck('identifier', reorderedTasks),
    );
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_FAILURE,
      dataToUpdate: { tasks: bundle.tasks },
      bundleIdentifier: bundle.identifier,
    });
  }
}

function* updateTemplateBundle({ bundle, dataToUpdate }) {
  try {
    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS,
      bundleIdentifier: bundle.identifier,
      dataToUpdate,
    });
    yield call(
      TemplateBundleApi.updateTemplateBundle,
      bundle.identifier,
      dataToUpdate,
    );

    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    console.log('error', error);
    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_FAILURE,
      bundleIdentifier: bundle.identifier,
      dataToUpdate: bundle,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* moveWorkflowToList({
  identifier,
  taskListIdentifier,
  taskGroupIdentifier,
}) {
  try {
    const workflow = yield call(
      TemplateBundleApi.moveWorkflowToList,
      identifier,
      taskListIdentifier,
      taskGroupIdentifier,
    );
    yield put({
      type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST_SUCCESS,
      identifier,
    });
    yield put({
      type: ActionTypes.ADD_TEMPLATE_BUNDLE,
      bundle: workflow,
    });
    yield put(showGlobalAlert(AlertMessages.MOVED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST_FAILURE,
      identifier,
    });
  }
}

function* changePatientForTemplateBundle({ taskTemplateIdentifier, patient }) {
  try {
    const bundle = yield call(
      TemplateBundleApi.updateTemplateBundle,
      taskTemplateIdentifier,
      {
        patientIdentifier: patient?.patientIdentifier || 'UNASSIGNED',
      },
    );

    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS,
      bundleIdentifier: bundle.identifier,
      dataToUpdate: !patient ? { ...bundle, patient: null } : bundle,
    });
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

function* applyTaskBundleFailure({
  error,
  errorType,
  failureDetails: { taskCount },
  templateDetails,
}) {
  if (errorType === ERROR_TYPES.ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST) {
    const modalProps = {
      taskCount,
      confirm: () => {
        store.dispatch(
          applyTemplateAction({ ...templateDetails, unassign: true }),
        );
      },
    };
    yield put(openModal('UnassignTaskTemplate', modalProps));
  } else {
    console.log(error);
    yield put(showGlobalErrorAlert());
  }
}

function* applyTemplate({
  taskTemplateIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
  patientIdentifier,
  options: { unassign = false },
}) {
  try {
    const addedBundle = yield call(TemplateBundleApi.applyTemplate, {
      taskTemplateIdentifier,
      taskListIdentifier,
      taskGroupIdentifier,
      patientIdentifier,
      unassign,
    });
    const isWarning = addedBundle.statusCode === 'WARNING';

    if (isWarning) {
      yield applyTaskBundleFailure({
        errorType: ERROR_TYPES.ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST,
        failureDetails: { taskCount: addedBundle.assignmentsMismatchCount },
        templateDetails: {
          taskTemplateIdentifier,
          taskGroupIdentifier,
          taskListIdentifier,
          patientIdentifier,
        },
      });
    } else {
      yield put(showGlobalAlert(AlertMessages.CREATED));
      yield put({
        type: ActionTypes.APPLY_TEMPLATE_SUCCESS,
        taskListIdentifier,
        template: addedBundle.taskWorkflowDto,
      });
    }
  } catch {
    yield put({ type: ActionTypes.APPLY_TEMPLATE_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* getTasksForWorkflow({ workflowIdentifier }) {
  try {
    const { tasks } = yield call(WorkflowApi.getWorkflow, workflowIdentifier);
    yield put({
      type: ActionTypes.GET_TASKS_FOR_WORKFLOW_SUCCESS,
      workflowIdentifier,
      tasks,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_TASKS_FOR_WORKFLOW_FAILURE,
      workflowIdentifier,
    });
  }
}

export default function* watchTemplateBundle() {
  yield takeEvery(ActionTypes.UPDATE_TEMPLATE_BUNDLE, updateTemplateBundle);
  yield takeEvery(
    ActionTypes.REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    reorderTasksInTemplateBundle,
  );
  yield takeEvery(
    ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST,
    moveWorkflowToList,
  );
  yield takeEvery(
    ActionTypes.CHANGE_PATIENT_FOR_TEMPLATE_BUNDLE,
    changePatientForTemplateBundle,
  );
  yield takeEvery(ActionTypes.APPLY_TEMPLATE, applyTemplate);
  yield takeEvery(ActionTypes.GET_TASKS_FOR_WORKFLOW, getTasksForWorkflow);
}
