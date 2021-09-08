import {
  ADD_TASK_TEMPLATE,
  ADD_TASK_TEMPLATE_FOLDER,
  DELETE_TASK_TEMPLATE,
  DUPLICATE_TASK_TEMPLATE,
  GET_ALL_TASK_TEMPLATES,
  GET_TASK_TEMPLATES,
  TOGGLE_TASK_TEMPLATE_OPEN,
  UPDATE_TASK_TEMPLATE,
  REORDER_TASKS_FOR_TEMPLATE,
  RELOAD_OPENED_TEMPLATE_TASKS,
  GO_TO_TASK_TEMPLATE_FOLDER,
  MOVE_TASK_TEMPLATE,
} from 'actions/action-types-saga';
import {
  all,
  call,
  put,
  select,
  take,
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
  parentFolderIdSelector,
  currentTaskTemplateIdentifierSelector,
} from 'selectors/task-template-selectors';
import { getUniqueLinkId } from 'helpers/task-template-builder-helpers';

function* moveTemplates({
  payload: { parentTaskTemplateIdentifier, taskTemplateIdentifier },
}) {
  try {
    const parentId = yield select(parentFolderIdSelector);
    if (parentTaskTemplateIdentifier !== parentId) {
      yield call(TaskTemplateApi.moveTemplate, {
        parentTaskTemplateIdentifier,
        taskTemplateIdentifier,
      });
      yield put({
        type: ActionTypes.DELETE_TASK_TEMPLATE,
        taskTemplateIdentifier,
      });
    }
    yield put(showGlobalAlert(AlertMessages.MOVED));
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_ERROR,
    });
  }
}

function* getTemplates({ searchPhrase }) {
  try {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_FETCHING,
    });
    const searchPhraseExist =
      searchPhrase && searchPhrase !== '' && searchPhrase !== ' ';
    const api = searchPhraseExist
      ? TaskTemplateApi.searchTemplates.bind(null, searchPhrase)
      : TaskTemplateApi.getTemplates;
    const templates = yield call(api, searchPhrase);
    yield put({
      type: ActionTypes.LOAD_TASK_TEMPLATES,
      templates,
    });
    yield put(TaskTemplateActions.cleanBreadcrumbs());

    // if (templates?.length > 0)
    //   yield put(
    //     TaskTemplateActions.toggleTemplateOpen(
    //       templates[0]?.taskTemplateIdentifier,
    //     ),
    //   );
  } catch {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_ERROR,
    });
  }
}

function* getAllTemplatesForOrganization({ searchPhrase }) {
  try {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_FETCHING,
    });
    const searchPhraseExist =
      searchPhrase && searchPhrase !== '' && searchPhrase !== ' ';
    const api = searchPhraseExist
      ? TaskTemplateApi.searchTemplates.bind(null, searchPhrase)
      : TaskTemplateApi.getAllTemplatesForOrganization;
    const templates = yield call(api, searchPhrase);
    yield put({
      type: ActionTypes.LOAD_TASK_TEMPLATES,
      templates,
    });
    yield put(TaskTemplateActions.cleanBreadcrumbs());

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

function* getTaskTemplatesFolder({
  payload: { taskTemplateFolderIdentifier },
}) {
  try {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_FETCHING,
    });
    const templates = yield call(
      TaskTemplateApi.getTemplatesForSpecificFolder,
      taskTemplateFolderIdentifier,
    );
    yield put({
      type: ActionTypes.LOAD_TASK_TEMPLATES_FOLDER,
      templates,
      taskTemplateFolderIdentifier,
    });

    if (templates?.length > 0)
      yield put(
        TaskTemplateActions.toggleTemplateOpen(
          templates[0]?.taskTemplateIdentifier,
        ),
      );
  } catch (error) {
    console.log(error);
    yield put({
      type: ActionTypes.TASK_TEMPLATES_ERROR,
    });
  }
}

function* addTemplate({ template, parentIdentifier = null }) {
  try {
    const parentId = yield select(parentFolderIdSelector);
    const createdTemplate = yield call(
      TaskTemplateApi.addTemplate,
      template,
      parentIdentifier || parentId,
    );
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
  } catch (error) {
    console.log(error);
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

    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    const templateDetails = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );

    const linkConnectedToCreatedTask = templateDetails?.temporaryElements?.filter(
      ({ source, target }) => source === elementId || target === elementId,
    );

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
      elementId && put(TaskTemplateActions.deleteTemporaryElement(elementId)),
    ]);

    if (linkConnectedToCreatedTask?.length > 0) {
      yield all(
        linkConnectedToCreatedTask.map(link => {
          const source = {
            id:
              elementId === link.source ? createdTask.identifier : link.source,
            handle: link.sourceHandle,
          };
          const target = {
            id:
              elementId === link.target ? createdTask.identifier : link.target,
            handle: link.targetHandle,
          };

          return put(TaskTemplateActions.linkTasks(source, target));
        }),
      );
    }

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
      put(TaskTemplateActions.getCurrentTaskTemplate()),
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

function* getCurrentTaskTemplate() {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    const template = yield call(
      TaskTemplateApi.getTemplate,
      taskTemplateIdentifier,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_TASK_TEMPLATE_SUCCESS,
      template,
    });
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
    const templateDetails = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );
    const updatedLayout = [
      ...(templateDetails?.layout?.filter(({ id }) => id !== taskIdentifier) ||
        []),
      { id: taskIdentifier, position },
    ];
    yield put(TaskTemplateActions.saveTaskTemplateLayout(updatedLayout));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* linkTasks({ source, target }) {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    const templateDetails = yield select(
      taskTemplateDetailsSelector(taskTemplateIdentifier),
    );

    const sourceTask = templateDetails?.tasks.find(
      ({ identifier }) => identifier === source.id,
    );
    const targetTask = templateDetails?.tasks.find(
      ({ identifier }) => identifier === target.id,
    );

    const checkIfTasksAreLinked = () => {
      return (
        sourceTask?.taskLinks?.some(
          ({ targetTaskIdentifier }) => targetTaskIdentifier === target.id,
        ) ||
        targetTask?.taskLinks?.some(
          ({ targetTaskIdentifier }) => targetTaskIdentifier === source.id,
        )
      );
    };

    if (!checkIfTasksAreLinked()) {
      yield put(
        TaskTemplateActions.addTemporaryLink(
          source.id,
          target.id,
          source.handle,
          target.handle,
        ),
      );

      if (targetTask && sourceTask) {
        const { sourceTaskIdentifier, targetTaskIdentifier } = yield call(
          TaskApi.createTasksLink,
          source.id,
          target.id,
        );
        const linkId = getUniqueLinkId(
          sourceTaskIdentifier,
          targetTaskIdentifier,
        );

        if (source.handle || target.handle) {
          const updatedLayout = [
            ...(templateDetails?.layout?.filter(({ id }) => id !== linkId) ||
              []),
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
        yield take(
          action =>
            action.type === ActionTypes.UPDATE_TASK_SUCCESS &&
            action.task?.identifier === sourceTaskIdentifier,
        );
        yield put(TaskTemplateActions.deleteTemporaryElement(linkId));
      }
    }
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
      yield call(TaskApi.updateTasksLink, {
        ...link,
        decisionOutcome: createdOutcome.taskOutcomeIdentifier,
      });
    }

    yield all([
      put(showGlobalAlert(AlertMessages.CREATED)),
      put(TaskActions.refreshTask(taskIdentifier)),
    ]);
  } catch (error) {
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
    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(TaskActions.refreshTask(taskIdentifier)),
    ]);
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteTaskFromLayout({ taskIdentifier }) {
  const taskTemplateIdentifier = yield select(
    currentTaskTemplateIdentifierSelector,
  );
  const templateDetails = yield select(
    taskTemplateDetailsSelector(taskTemplateIdentifier),
  );
  if (templateDetails?.layout?.length > 0) {
    const updatedLayout = templateDetails?.layout?.filter(
      ({ id }) => id !== taskIdentifier,
    );
    if (templateDetails?.layout.length !== updatedLayout.length)
      yield put(TaskTemplateActions.saveTaskTemplateLayout(updatedLayout));
  }
}

export default function* watchTaskTemplate() {
  yield takeEvery(MOVE_TASK_TEMPLATE, moveTemplates);
  yield takeEvery(GO_TO_TASK_TEMPLATE_FOLDER, getTaskTemplatesFolder);
  yield takeEvery(ADD_TASK_TEMPLATE, addTemplate);
  yield takeEvery(ADD_TASK_TEMPLATE_FOLDER, addTemplate);
  yield takeEvery(DELETE_TASK_TEMPLATE, deleteTemplate);
  yield takeLatest(GET_ALL_TASK_TEMPLATES, getAllTemplatesForOrganization);
  yield takeLatest(GET_TASK_TEMPLATES, getTemplates);
  yield takeEvery(TOGGLE_TASK_TEMPLATE_OPEN, toggleTemplateOpen);
  yield takeEvery(UPDATE_TASK_TEMPLATE, updateTemplate);
  yield takeEvery(DUPLICATE_TASK_TEMPLATE, duplicateTemplate);
  yield takeEvery(REORDER_TASKS_FOR_TEMPLATE, reorderTasksForTemplate);
  yield takeLatest(RELOAD_OPENED_TEMPLATE_TASKS, reloadOpenedTemplateTasks);
  yield takeEvery(ActionTypes.GET_TASK_TEMPLATE_TASKS, getTasksForTemplate);
  yield takeEvery(ActionTypes.ADD_TASK_TO_TEMPLATE, addTaskToTemplate);
  yield takeEvery(ActionTypes.GET_TASK_TEMPLATE_LAYOUT, getTaskTemplateLayout);
  yield takeLatest(ActionTypes.SELECT_TASK_TEMPLATE, selectTaskTemplate);
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
  yield takeEvery(ActionTypes.DELETE_TASK, deleteTaskFromLayout);
  yield takeLatest(
    ActionTypes.GET_CURRENT_TASK_TEMPLATE,
    getCurrentTaskTemplate,
  );
}
