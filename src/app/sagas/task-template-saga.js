import {
  ADD_TASK_TEMPLATE,
  DELETE_TASK_TEMPLATE,
  DUPLICATE_TASK_TEMPLATE,
  GET_TASK_TEMPLATES,
  TOGGLE_TASK_TEMPLATE_OPEN,
  UPDATE_TASK_TEMPLATE,
  REORDER_TASKS_FOR_TEMPLATE,
  ADD_TASK_TO_TEMPLATE,
  RELOAD_OPENED_TEMPLATE_TASKS,
  APPLY_TASK_TEMPLATE,
  DELETE_TEMPLATE_BUNDLE,
  MOVE_TEMPLATE_BUNDLE,
  DUPLICATE_TEMPLATE_BUNDLE,
} from 'actions/action-types-saga';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { move, omit, pluck } from 'ramda';
import * as ActionTypes from 'actions/action-types';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import AlertMessages from 'alert/AlertMessages';
import * as TaskTemplateApi from 'api/task-template-api';
import * as TaskApi from 'api/task-api';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';
import {
  taskTemplateDetailsSelector,
  taskTemplateSelector,
  allTaskTemplateDetailsSelector,
} from 'selectors/task-template-selectors';
import { listDetailsGroupsSelector } from 'selectors/list-details-selectors';

function* getTemplates() {
  try {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_FETCHING,
    });
    const templates = yield call(TaskTemplateApi.getTemplates);
    yield put({
      type: ActionTypes.LOAD_TASK_TEMPLATES,
      templates,
    });

    if (templates?.length > 0)
      yield put(
        TaskTemplateActions.toggleTemplateOpen(
          templates[0]?.taskTemplateIdentifier,
        ),
      );
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_ERROR,
    });
  }
}

function* addTemplate({ template }) {
  try {
    const createdTemplate = yield call(TaskTemplateApi.addTemplate, template);

    yield put({
      type: ActionTypes.ADD_TASK_TEMPLATE,
      template: createdTemplate,
    });

    yield put({
      type: ActionTypes.INITIALIZE_TASK_TEMPLATE_DETAILS,
      taskTemplateIdentifier: createdTemplate.taskTemplateIdentifier,
    });

    yield put(
      TaskTemplateActions.toggleTemplateOpen(
        createdTemplate.taskTemplateIdentifier,
      ),
    );

    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteTemplate({ taskTemplateIdentifier }) {
  try {
    yield put({
      type: ActionTypes.DELETE_TASK_TEMPLATE,
      taskTemplateIdentifier,
    });
    yield call(TaskTemplateApi.deleteTemplate, taskTemplateIdentifier);
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield call(getTemplates);
  }
}

function* duplicateTemplate({ taskTemplateIdentifier, includeAttachments }) {
  try {
    const template = yield call(
      TaskTemplateApi.duplicateTemplate,
      taskTemplateIdentifier,
      includeAttachments,
    );
    yield put({ type: ActionTypes.ADD_TASK_TEMPLATE, template });
    yield put(
      TaskTemplateActions.toggleTemplateOpen(template.taskTemplateIdentifier),
    );
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTemplate({ taskTemplateIdentifier, dataToUpdate }) {
  const template = yield select(taskTemplateSelector(taskTemplateIdentifier));

  try {
    const updatedTemplate = {
      ...template,
      ...omit(['taskTemplateIdentifier'], dataToUpdate),
    };
    yield put({
      type: ActionTypes.UPDATE_TASK_TEMPLATE,
      taskTemplateIdentifier,
      dataToUpdate,
    });
    yield call(TaskTemplateApi.updateTemplate, updatedTemplate);
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_TASK_TEMPLATE,
      taskTemplateIdentifier,
      dataToUpdate: template,
    });
  }
}

function* getTasksForTemplate({ taskTemplateIdentifier, withLoader = true }) {
  try {
    if (withLoader) {
      yield put({
        type: ActionTypes.TASK_TEMPLATE_FETCHING,
        taskTemplateIdentifier,
      });
    }

    const tasks = yield call(
      TaskTemplateApi.getTasksForTemplate,
      taskTemplateIdentifier,
    );
    yield put({
      type: ActionTypes.LOAD_TASKS_FOR_TASK_TEMPLATE,
      taskTemplateIdentifier,
      tasks,
    });
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

function* toggleTemplateOpen({ taskTemplateIdentifier }) {
  try {
    const templateDetails = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );

    yield all([
      !templateDetails?.isOpen
        ? call(getTasksForTemplate, {
            taskTemplateIdentifier,
            withLoader: !templateDetails?.tasks,
          })
        : null,
      put({
        type: ActionTypes.TOGGLE_TASK_TEMPLATE_OPEN,
        taskTemplateIdentifier,
      }),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* reorderTasksForTemplate(payload) {
  const {
    destination: { index: destinationIndex },
    source: { index: sourceIndex },
    taskTemplateIdentifier,
  } = payload;

  const templateDetails = yield select(
    taskTemplateDetailsSelector(taskTemplateIdentifier),
  );

  try {
    const reorderedTasks = move(
      sourceIndex,
      destinationIndex,
      templateDetails?.tasks || [],
    );

    yield put({
      type: ActionTypes.LOAD_TASKS_FOR_TASK_TEMPLATE,
      taskTemplateIdentifier,
      tasks: reorderedTasks,
    });

    yield call(
      TaskTemplateApi.reorderTasksForTemplate,
      taskTemplateIdentifier,
      pluck('taskIdentifier', reorderedTasks),
    );

    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.LOAD_TASKS_FOR_TASK_TEMPLATE,
      taskTemplateIdentifier,
      tasks: templateDetails?.tasks || [],
    });
  }
}

function* addTaskToTemplate({ task }) {
  try {
    const createdTask = yield call(TaskApi.addTask, task);
    yield put({
      type: ActionTypes.ADD_TASK_TO_TEMPLATE,
      task: {
        ...createdTask,
        taskTemplateIdentifier: task.taskTemplateIdentifier,
      },
    });
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* reloadOpenedTemplateTasks() {
  const allTemplateDetails =
    (yield select(allTaskTemplateDetailsSelector)) || {};

  yield all([
    ...Object.entries(allTemplateDetails).reduce(
      (accumulator, [key, value]) => {
        if (value.isOpen) {
          return [
            ...accumulator,
            call(getTasksForTemplate, {
              taskTemplateIdentifier: key,
              withLoader: false,
            }),
          ];
        }
        return accumulator;
      },
      [],
    ),
  ]);
}

function* applyTaskTemplate({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
}) {
  try {
    yield call(
      TaskTemplateApi.useTemplate,
      taskTemplateIdentifier,
      taskGroupIdentifier,
      taskListIdentifier,
    );
    yield put(
      ListDetailsSagaActions.getTasksForTaskGroups({
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        refresh: true,
      }),
    );
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

function* duplicateTemplateBundle({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  includeAttachments,
}) {
  try {
    yield call(
      TaskTemplateApi.duplicateTemplateBundle,
      taskTemplateIdentifier,
      includeAttachments,
    );
    yield put(
      ListDetailsSagaActions.getTasksForTaskGroups({
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        refresh: true,
      }),
    );
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

function* moveTemplateBundle({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  selectedDestination,
}) {
  try {
    const listGroups = yield select(listDetailsGroupsSelector);
    const isDestinationGroupInCurrentList = listGroups?.some(
      lg =>
        lg.taskGroupIdentifier ===
        selectedDestination.parentTaskGroupIdentifier,
    );

    yield call(
      TaskTemplateApi.moveTemplateBundle,
      taskTemplateIdentifier,
      selectedDestination,
    );

    yield put(
      ListDetailsSagaActions.getTasksForTaskGroups({
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        refresh: true,
      }),
    );

    if (isDestinationGroupInCurrentList) {
      yield put(
        ListDetailsSagaActions.getTasksForTaskGroups({
          taskGroupIdentifier: selectedDestination.parentTaskGroupIdentifier,
          status: 'INCOMPLETE',
          refresh: true,
        }),
      );
    }
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

function* deleteTemplateBundle({
  taskTemplateIdentifier,
  taskGroupIdentifier,
}) {
  try {
    yield call(TaskTemplateApi.deleteTemplateBundle, taskTemplateIdentifier);
    yield put(
      ListDetailsSagaActions.getTasksForTaskGroups({
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        refresh: true,
      }),
    );
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATE_ERROR,
      taskTemplateIdentifier,
    });
  }
}

export default function* watchTaskTemplate() {
  yield takeEvery(ADD_TASK_TEMPLATE, addTemplate);
  yield takeEvery(DELETE_TASK_TEMPLATE, deleteTemplate);
  yield takeLatest(GET_TASK_TEMPLATES, getTemplates);
  yield takeEvery(TOGGLE_TASK_TEMPLATE_OPEN, toggleTemplateOpen);
  yield takeEvery(UPDATE_TASK_TEMPLATE, updateTemplate);
  yield takeEvery(DUPLICATE_TASK_TEMPLATE, duplicateTemplate);
  yield takeEvery(REORDER_TASKS_FOR_TEMPLATE, reorderTasksForTemplate);
  yield takeEvery(ADD_TASK_TO_TEMPLATE, addTaskToTemplate);
  yield takeLatest(RELOAD_OPENED_TEMPLATE_TASKS, reloadOpenedTemplateTasks);
  yield takeEvery(APPLY_TASK_TEMPLATE, applyTaskTemplate);
  yield takeEvery(DUPLICATE_TEMPLATE_BUNDLE, duplicateTemplateBundle);
  yield takeEvery(MOVE_TEMPLATE_BUNDLE, moveTemplateBundle);
  yield takeEvery(DELETE_TEMPLATE_BUNDLE, deleteTemplateBundle);
}
