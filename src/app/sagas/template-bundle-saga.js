import { pluck, move } from 'ramda';
import * as ActionTypesSaga from 'actions/action-types-saga';
import * as ActionTypes from 'actions/action-types';
import AlertMessages from 'alert/AlertMessages';
import * as TemplateBundleApi from 'api/template-bundle-api';
import { call, put, takeEvery } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { TaskStatus } from 'helpers/task-helpers';

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
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
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
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
      dataToUpdate: { tasks: bundle.tasks },
      bundleIdentifier: bundle.identifier,
    });
  }
}

function* updateTemplateBundle({ bundle, dataToUpdate }) {
  try {
    yield put({
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
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
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
      bundleIdentifier: bundle.identifier,
      dataToUpdate: bundle,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* duplicateTemplateBundle({ bundleIdentifier, includeAttachments }) {
  try {
    const duplicatedBundle = yield call(
      TemplateBundleApi.duplicateTemplateBundle,
      bundleIdentifier,
      includeAttachments,
    );
    yield put({
      type: ActionTypes.ADD_TEMPLATE_BUNDLE,
      bundle: duplicatedBundle,
    });
    yield put(showGlobalAlert(AlertMessages.DUPLICATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteTemplateBundle({ bundleIdentifier }) {
  try {
    yield call(TemplateBundleApi.deleteTemplateBundle, bundleIdentifier);
    yield put({ type: ActionTypes.DELETE_TEMPLATE_BUNDLE, bundleIdentifier });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* moveTemplateBundle({
  bundleIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
}) {
  try {
    const updatedBundle = yield call(
      TemplateBundleApi.moveTemplateBundle,
      bundleIdentifier,
      taskListIdentifier,
      taskGroupIdentifier,
    );
    yield put({ type: ActionTypes.DELETE_TEMPLATE_BUNDLE, bundleIdentifier });
    yield put({
      type: ActionTypes.ADD_TEMPLATE_BUNDLE,
      bundle: updatedBundle,
    });
    yield put(showGlobalAlert(AlertMessages.MOVED));
  } catch {
    yield put(showGlobalErrorAlert());
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
      type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
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

export default function* watchTemplateBundle() {
  yield takeEvery(ActionTypesSaga.UPDATE_TEMPLATE_BUNDLE, updateTemplateBundle);
  yield takeEvery(
    ActionTypesSaga.REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    reorderTasksInTemplateBundle,
  );
  yield takeEvery(
    ActionTypesSaga.DUPLICATE_TEMPLATE_BUNDLE,
    duplicateTemplateBundle,
  );
  yield takeEvery(ActionTypesSaga.DELETE_TEMPLATE_BUNDLE, deleteTemplateBundle);
  yield takeEvery(ActionTypesSaga.MOVE_TEMPLATE_BUNDLE, moveTemplateBundle);
  yield takeEvery(
    ActionTypesSaga.CHANGE_PATIENT_FOR_TEMPLATE_BUNDLE,
    changePatientForTemplateBundle,
  );
}
