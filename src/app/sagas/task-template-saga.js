import {
  ADD_TASK_TEMPLATE,
  DELETE_TASK_TEMPLATE,
  DUPLICATE_TASK_TEMPLATE,
  GET_TASK_TEMPLATES,
  TOGGLE_TASK_TEMPLATE_OPEN,
  UPDATE_TASK_TEMPLATE,
  REORDER_TASKS_FOR_TEMPLATE,
  RELOAD_OPENED_TEMPLATE_TASKS,
} from 'actions/action-types-saga';
import {
  ADD_TASK_TO_TEMPLATE,
  SELECT_TASK_TEMPLATE,
  GET_TASK_TEMPLATE_TASKS,
} from 'actions/action-types';
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
import * as TaskActions from 'actions/task-actions';
import AlertMessages from 'alert/AlertMessages';
import * as TaskTemplateApi from 'api/task-template-api';
import * as TaskApi from 'api/task-api';
import {
  taskTemplateDetailsSelector,
  taskTemplateSelector,
  allTemplateDetailsSelector,
  currentTaskTemplateIdentifierSelector,
} from 'selectors/task-template-selectors';
import { getUniqueLinkId } from 'helpers/task-template-builder-helpers';

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

function* getTasksForTemplate({ taskTemplateIdentifier }) {
  try {
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
    yield put(showGlobalErrorAlert());
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
        ? put(
            TaskTemplateActions.getTemplateTasks(
              taskTemplateIdentifier,
              !templateDetails?.tasks,
            ),
          )
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

function* addTaskToTemplate({ task, elementId, position }) {
  try {
    const createdTask = yield call(TaskApi.addTask, task);
    yield all([
      position &&
        put({
          type: ActionTypes.UPDATE_TASK_POSITION_IN_LAYOUT,
          taskIdentifier: createdTask.identifier,
          position,
        }),
      put({
        type: ActionTypes.ADD_TASK_TO_TEMPLATE_SUCCESS,
        task: {
          ...createdTask,
          taskTemplateIdentifier: task.taskTemplateIdentifier,
        },
      }),
      elementId && put(TaskTemplateActions.deleteNewTaskElement(elementId)),
    ]);
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* reloadOpenedTemplateTasks() {
  const allTemplateDetails = (yield select(allTemplateDetailsSelector)) || {};

  yield all([
    ...Object.entries(allTemplateDetails).reduce(
      (accumulator, [key, value]) => {
        if (value.isOpen) {
          return [
            ...accumulator,
            put(TaskTemplateActions.getTemplateTasks(key, false)),
          ];
        }
        return accumulator;
      },
      [],
    ),
  ]);
}

function* getTaskTemplateLayout({ taskTemplateIdentifier }) {
  try {
    const layout = yield call(
      TaskTemplateApi.getTemplateLayout,
      taskTemplateIdentifier,
    );
    yield put({
      type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS,
      taskTemplateIdentifier,
      layout,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      yield put({
        type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS,
        taskTemplateIdentifier,
        layout: [],
      });
    } else {
      yield put(showGlobalErrorAlert());
    }
  }
}

function* selectTaskTemplate({ taskTemplateIdentifier }) {
  try {
    yield all([
      put(TaskTemplateActions.getTemplateTasks(taskTemplateIdentifier)),
      put({
        type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT,
        taskTemplateIdentifier,
      }),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* saveTaskTemplateLayout({ layout }) {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    yield call(
      TaskTemplateApi.saveTemplateLayout,
      taskTemplateIdentifier,
      layout,
    );
    yield put({
      type: ActionTypes.SAVE_TASK_TEMPLATE_LAYOUT_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskPositionInLayout({ taskIdentifier, position }) {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    const { layout } = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );
    const updatedLayout = [
      ...(layout?.filter(({ id }) => id !== taskIdentifier) || []),
      { id: taskIdentifier, position },
    ];
    yield put(TaskTemplateActions.saveTaskTemplateLayout(updatedLayout));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* linkTasks({ source, target, isDependent }) {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    const { layout, tasks } = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );

    const sourceTask = tasks.find(({ identifier }) => identifier === source.id);
    const targetTask = tasks.find(({ identifier }) => identifier === target.id);

    const checkIfTasksAreLinked = () => {
      return (
        sourceTask.taskLinks?.some(
          ({ targetTaskIdentifier }) => targetTaskIdentifier === target.id,
        ) ||
        targetTask.taskLinks?.some(
          ({ targetTaskIdentifier }) => targetTaskIdentifier === source.id,
        )
      );
    };

    if (targetTask && sourceTask && !checkIfTasksAreLinked()) {
      const { sourceTaskIdentifier, targetTaskIdentifier } = yield call(
        TaskTemplateApi.createTasksLink,
        source.id,
        target.id,
        {
          isDependent,
        },
      );

      if (source.handle || target.handle) {
        const linkId = getUniqueLinkId(
          sourceTaskIdentifier,
          targetTaskIdentifier,
        );
        const updatedLayout = [
          ...(layout?.filter(({ id }) => id !== linkId) || []),
          {
            id: linkId,
            sourceHandle: source.handle,
            targetHandle: target.handle,
          },
        ];
        yield put(TaskTemplateActions.saveTaskTemplateLayout(updatedLayout));
      }

      yield all([
        put(TaskActions.refreshTask(sourceTaskIdentifier)),
        put(TaskActions.refreshTask(targetTaskIdentifier)),
      ]);
    }
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTasksLink({ link }) {
  const { sourceTaskIdentifier, targetTaskIdentifier } = link;
  try {
    yield call(TaskTemplateApi.updateTasksLink, link);
    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield all([
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
      TaskTemplateApi.deleteTasksLink,
      sourceTaskIdentifier,
      targetTaskIdentifier,
    );
    yield put(showGlobalAlert(AlertMessages.DELETED));
    yield all([
      put(TaskActions.refreshTask(sourceTaskIdentifier)),
      put(TaskActions.refreshTask(targetTaskIdentifier)),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* addTaskOutcome({ outcomeName, taskIdentifier, link }) {
  try {
    const createdOutcome = yield call(
      TaskTemplateApi.addTaskOutcome,
      taskIdentifier,
      outcomeName,
    );

    if (link) {
      yield put(TaskTemplateApi.updateTasksLink, {
        ...link,
        decisionOutcome: createdOutcome.taskOutcomeIdentifier,
      });
    }

    yield put(showGlobalAlert(AlertMessages.CREATED));
    yield put(TaskActions.refreshTask(taskIdentifier));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* updateTaskOutcome({
  taskOutcomeIdentifier,
  taskIdentifier,
  outcomeName,
}) {
  try {
    yield call(TaskTemplateApi.updateTaskOutcome, taskOutcomeIdentifier, {
      name: outcomeName,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));

    yield put(TaskActions.refreshTask(taskIdentifier));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTaskTemplate() {
  yield takeEvery(ADD_TASK_TEMPLATE, addTemplate);
  yield takeEvery(DELETE_TASK_TEMPLATE, deleteTemplate);
  yield takeLatest(GET_TASK_TEMPLATES, getTemplates);
  yield takeEvery(GET_TASK_TEMPLATE_TASKS, getTasksForTemplate);
  yield takeEvery(TOGGLE_TASK_TEMPLATE_OPEN, toggleTemplateOpen);
  yield takeEvery(UPDATE_TASK_TEMPLATE, updateTemplate);
  yield takeEvery(DUPLICATE_TASK_TEMPLATE, duplicateTemplate);
  yield takeEvery(REORDER_TASKS_FOR_TEMPLATE, reorderTasksForTemplate);
  yield takeEvery(ADD_TASK_TO_TEMPLATE, addTaskToTemplate);
  yield takeLatest(RELOAD_OPENED_TEMPLATE_TASKS, reloadOpenedTemplateTasks);
  yield takeEvery(ActionTypes.GET_TASK_TEMPLATE_LAYOUT, getTaskTemplateLayout);
  yield takeLatest(SELECT_TASK_TEMPLATE, selectTaskTemplate);
  yield takeLatest(
    ActionTypes.SAVE_TASK_TEMPLATE_LAYOUT,
    saveTaskTemplateLayout,
  );
  yield takeEvery(
    ActionTypes.UPDATE_TASK_POSITION_IN_LAYOUT,
    updateTaskPositionInLayout,
  );
  yield takeEvery(ActionTypes.LINK_TASKS, linkTasks);
  yield takeEvery(ActionTypes.ADD_TASK_OUTCOME, addTaskOutcome);
  yield takeEvery(ActionTypes.UPDATE_TASK_OUTCOME, updateTaskOutcome);
  yield takeEvery(ActionTypes.DELETE_TASKS_LINK, deleteTasksLink);
  yield takeEvery(ActionTypes.UPDATE_TASKS_LINK, updateTasksLink);
}
