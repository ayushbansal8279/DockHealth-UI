import * as ActionTypes from 'actions/action-types';
import AlertMessages from 'alert/AlertMessages';
import * as TemplateBundleApi from 'api/template-bundle-api';
import * as WorkflowApi from 'api/workflow-api';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { applyTemplate as applyTemplateAction } from 'actions/template-bundle-actions';
import { openModal } from 'modal/actions';
import { getTasksForTaskGroups } from 'actions/list-details-actions';
import { log } from 'helpers/log';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import store from '../store';
import { locationParametersSelector } from '../location/selectors';

const ERROR_TYPES = {
  ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST:
    'TASK_TEMPLATE/ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST',
};

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
    log('error', error);
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

function* moveWorkflowToGroup({
  identifier,
  taskGroupIdentifier,
  templateGroup,
}) {
  try {
    yield call(
      TemplateBundleApi.moveWorkflowToGroup,
      identifier,
      taskGroupIdentifier,
    );
    yield put({
      type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_GROUP_SUCCESS,
      identifier,
      taskGroupIdentifier,
      templateGroup,
    });
    const { taskListIdentifier } = yield select(locationParametersSelector);
    if (taskListIdentifier) {
      yield put(
        getTasksForTaskGroups({
          taskGroupIdentifier,
          status: 'INCOMPLETE',
          refresh: true,
        }),
      );
    }

    yield put(showGlobalAlert(AlertMessages.MOVED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_GROUP_FAILURE,
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
      dataToUpdate: patient ? bundle : { ...bundle, patient: null },
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
    log(error);
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
      yield put(PatientDetailsActions.getCurrentPatientTasks());
    }
  } catch {
    yield put({ type: ActionTypes.APPLY_TEMPLATE_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* getTasksForWorkflow({ workflowIdentifier, status }) {
  try {
    const { tasks } = yield call(WorkflowApi.getWorkflow, workflowIdentifier);
    const statusToSelect = status || 'ALL';

    const tasksBasedOnStatus =
      statusToSelect === 'ALL'
        ? tasks
        : tasks.filter((task) => task.status === statusToSelect);

    yield put({
      type: ActionTypes.GET_TASKS_FOR_WORKFLOW_SUCCESS,
      workflowIdentifier,
      tasks: tasksBasedOnStatus,
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
    ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST,
    moveWorkflowToList,
  );
  yield takeEvery(
    ActionTypes.CHANGE_PATIENT_FOR_TEMPLATE_BUNDLE,
    changePatientForTemplateBundle,
  );
  yield takeEvery(ActionTypes.APPLY_TEMPLATE, applyTemplate);
  yield takeEvery(ActionTypes.GET_TASKS_FOR_WORKFLOW, getTasksForWorkflow);
  yield takeEvery(
    ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_GROUP,
    moveWorkflowToGroup,
  );
}
