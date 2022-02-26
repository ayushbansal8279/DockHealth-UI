import {
  all,
  call,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { move, omit, pluck, reverse } from 'ramda';
import * as ActionTypes from 'actions/action-types';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as TaskTemplateActions from 'actions/task-template-actions';
import * as TaskActions from 'actions/task-actions';
import AlertMessages from 'alert/AlertMessages';
import * as TaskTemplateApi from 'api/task-template-api';
import * as TaskApi from 'api/task-api';
import { createWorkflowBuilderPath } from 'routing/helpers/paths';
import {
  currentFolderIdentifierSelector,
  taskTemplateDetailsSelector,
  taskTemplateSelector,
  allTemplateDetailsSelector,
  currentTaskTemplateIdentifierSelector,
} from 'selectors/task-template-selectors';
import {
  createTemporaryOptionsForDecisionTask,
  getUniqueLinkId,
  LinkType,
  NodeType,
} from 'helpers/task-template-builder-helpers';
import {
  addLabel,
  editLabel,
  removeLabelForTask,
  removeLabelFromDatabase,
} from 'api/task-label-api';
import { getLabels } from 'actions/workflow-drawer-actions';

function* initializeWorkflowLibraryState({ folderIdentifier }) {
  yield all([
    folderIdentifier && put(TaskTemplateActions.getFolderBreadcrumbs()),
    put(TaskTemplateActions.getWorkflowFolder()),
  ]);
}

function* moveWorkflowToFolder({ parentTaskWorkflowIdentifier, identifier }) {
  try {
    const folderIdentifier = yield select(currentFolderIdentifierSelector);
    if (parentTaskWorkflowIdentifier !== folderIdentifier) {
      yield call(
        TaskTemplateApi.moveTemplateToFolder,
        identifier,
        parentTaskWorkflowIdentifier,
      );
      yield put({
        type: ActionTypes.MOVE_WORKFLOW_TO_FOLDER_SUCCESS,
        identifier,
      });
    }
    yield put(showGlobalAlert(AlertMessages.MOVED));
  } catch {
    yield put({
      type: ActionTypes.MOVE_WORKFLOW_TO_FOLDER_FAILURE,
      identifier,
      parentTaskWorkflowIdentifier,
    });
  }
}

function* getWorkflowFolder({ searchPhrase }) {
  try {
    const folderIdentifier = yield select(currentFolderIdentifierSelector);
    let workflows;

    if (folderIdentifier) {
      workflows = yield call(
        TaskTemplateApi.getTemplatesForSpecificFolder,
        folderIdentifier,
      );
    } else {
      const searchPhraseExist =
        searchPhrase && searchPhrase !== '' && searchPhrase !== ' ';
      const api = searchPhraseExist
        ? TaskTemplateApi.searchTemplates.bind(null, searchPhrase)
        : TaskTemplateApi.getTemplates;
      workflows = yield call(api, searchPhrase);
    }

    yield put({
      type: ActionTypes.GET_WORKFLOW_FOLDER_SUCCESS,
      workflows,
    });

    if (workflows?.length > 0 && workflows[0]?.type === 'WORKFLOW') {
      yield put(
        TaskTemplateActions.toggleTemplateOpen(workflows[0]?.identifier),
      );
    }
  } catch {
    yield all([
      put({
        type: ActionTypes.GET_WORKFLOW_FOLDER_FAILURE,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* getFolderBreadcrumbs() {
  try {
    const folderIdentifier = yield select(currentFolderIdentifierSelector);
    if (folderIdentifier) {
      const breadcrumbs = [];
      let nextFolderIdentifier = folderIdentifier;
      do {
        const workflowFolder = yield call(
          TaskTemplateApi.getTemplate,
          folderIdentifier,
        );
        breadcrumbs.push({
          id: workflowFolder.identifier,
          name: workflowFolder.name,
        });
        nextFolderIdentifier = workflowFolder.parentTaskWorkflowIdentifier;
      } while (nextFolderIdentifier);
      yield put({
        type: ActionTypes.GET_FOLDER_BREADCRUMBS_SUCCESS,
        breadcrumbs: reverse(breadcrumbs),
      });
    }
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({ type: ActionTypes.GET_FOLDER_BREADCRUMBS_FAILURE }),
    ]);
  }
}

function* getWorkflowDetails({ taskWorkflowIdentifier }) {
  try {
    const workflow = yield call(
      TaskTemplateApi.getTemplate,
      taskWorkflowIdentifier,
    );

    yield put({
      type: ActionTypes.GET_WORKFLOW_DETAILS_SUCCESS,
      workflow,
    });
  } catch {
    yield all([
      put({
        type: ActionTypes.GET_WORKFLOW_DETAILS_FAILURE,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* addTemplate({ template, parentIdentifier = null, history }) {
  try {
    const folderIdentifier = yield select(currentFolderIdentifierSelector);
    const createdTemplate = yield call(
      TaskTemplateApi.addTemplate,
      template,
      parentIdentifier || folderIdentifier,
    );
    yield put({
      type: ActionTypes.ADD_TASK_TEMPLATE_SUCCESS,
      template: createdTemplate,
    });
    yield put({
      type: ActionTypes.INITIALIZE_TASK_TEMPLATE_DETAILS,
      taskTemplateIdentifier: createdTemplate.identifier,
    });

    yield put(
      TaskTemplateActions.toggleTemplateOpen(createdTemplate.identifier),
    );

    yield put(showGlobalAlert(AlertMessages.CREATED));

    try {
      if (history) {
        yield call(
          history.push,
          createWorkflowBuilderPath(createdTemplate.identifier),
        );
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
    yield put(showGlobalErrorAlert());
  }
}

function* updatePartialWorkflow({ taskWorkflowIdentifier, dataToUpdate }) {
  try {
    const newData = yield call(
      TaskTemplateApi.updatePartialWorkflow,
      taskWorkflowIdentifier,
      dataToUpdate,
    );
    yield put({
      type: ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS,
      newData,
      taskWorkflowIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_PARTIAL_WORKFLOW_FAILURE,
    });
  }
}

function* switchTemplatePublic({ taskTemplateIdentifier, flagPublic }) {
  const template = yield select(taskTemplateSelector(taskTemplateIdentifier));

  try {
    yield put({
      type: ActionTypes.UPDATE_TASK_TEMPLATE_SUCCESS,
      taskTemplateIdentifier,
      dataToUpdate: { publicAccess: flagPublic },
    });
    yield call(
      TaskTemplateApi.switchTemplatePublic,
      taskTemplateIdentifier,
      flagPublic,
    );
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_TASK_TEMPLATE_FAILURE,
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

    if (templateDetails?.isOpen)
      yield put(
        TaskTemplateActions.getTemplateTasks(
          taskTemplateIdentifier,
          !templateDetails?.tasks,
        ),
      );
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

          return put(
            TaskTemplateActions.linkTasks(
              source,
              target,
              {},
              link.outcomeName || null,
            ),
          );
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

function* getTaskTemplateLayout({ identifier }) {
  try {
    const layout = yield call(TaskTemplateApi.getTemplateLayout, identifier);
    yield put({
      type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS,
      identifier,
      layout,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      yield put({
        type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT_SUCCESS,
        identifier,
        layout: [],
      });
    } else {
      yield put(showGlobalErrorAlert());
    }
  }
}

function* selectTaskTemplate({ identifier }) {
  try {
    yield all([
      put(TaskTemplateActions.getCurrentTaskTemplate()),
      put(TaskTemplateActions.getTemplateTasks(identifier)),
      put({
        type: ActionTypes.GET_TASK_TEMPLATE_LAYOUT,
        identifier,
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

// eslint-disable-next-line sonarjs/cognitive-complexity
function* linkTasks({ source, target, options, outcomeName }) {
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
      const isSourceDecisionType = sourceTask
        ? sourceTask.intentType === NodeType.DECISION
        : templateDetails.temporaryElements.some(
            ({ id, type }) =>
              id === source.id && type === NodeType.NEW_DECISION,
          );

      yield put(
        TaskTemplateActions.addTemporaryLink(
          isSourceDecisionType
            ? LinkType.TEMPORARY_DECISION
            : LinkType.TEMPORARY,
          source.id,
          target.id,
          source.handle,
          target.handle,
        ),
      );

      if (targetTask && sourceTask) {
        if (outcomeName) {
          yield put(TaskTemplateActions.addTaskOutcome(outcomeName, source.id));

          const { outcome } = yield take(
            action =>
              action.type === ActionTypes.ADD_TASK_OUTCOME_SUCCESS &&
              action.taskIdentifier === source.id &&
              action.outcome.name === outcomeName,
          );
          // eslint-disable-next-line no-param-reassign
          options = {
            ...(options || {}),
            decisionOutcome: outcome.taskOutcomeIdentifier,
          };
        }

        const link = yield call(
          TaskApi.createTasksLink,
          source.id,
          target.id,
          options,
        );

        const { sourceTaskIdentifier, targetTaskIdentifier } = link;
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
          put({ type: ActionTypes.LINK_TASKS_SUCCESS, link }),
          put(TaskActions.refreshTask(targetTaskIdentifier)),
          put(TaskTemplateActions.deleteTemporaryElement(linkId)),
        ]);
      }
    }
  } catch (error) {
    console.log('errorrr', error);
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
      put({
        type: ActionTypes.ADD_TASK_OUTCOME_SUCCESS,
        taskIdentifier,
        outcome: createdOutcome,
        link,
      }),
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

function* changeTaskIntentType({ taskIdentifier, intentType }) {
  try {
    const taskTemplateIdentifier = yield select(
      currentTaskTemplateIdentifierSelector,
    );
    if (taskTemplateIdentifier && intentType === NodeType.DECISION) {
      const { layout, temporaryElements } = yield select(
        taskTemplateDetailsSelector(taskTemplateIdentifier),
      );
      if (layout?.length > 0) {
        const { position } =
          layout?.find(({ id }) => taskIdentifier === id) || {};
        const newTemporaryOptions = createTemporaryOptionsForDecisionTask(
          temporaryElements,
          taskIdentifier,
          position,
        );
        yield put(
          TaskTemplateActions.addTemporaryElements(newTemporaryOptions),
        );
      }
    }
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* addWorkflowLabel({
  labelName,
  labelIdentifier,
  identifier,
  isTemplateWorkflow,
  taskListIdentifier,
}) {
  const payload = {
    labelName,
    taskWorkflowIdentifier: identifier,
    labelIdentifier,
    isTemplateWorkflow,
    taskListIdentifier,
  };
  try {
    const newLabel = yield call(addLabel, payload);
    yield put({ type: ActionTypes.ADD_WORKFLOW_LABEL_SUCCESS, newLabel });
    yield put(getLabels({ isTemplateWorkflow, taskListIdentifier }));
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: ActionTypes.ADD_WORKFLOW_LABEL_FAILURE, payload });
    yield put(showGlobalErrorAlert());
  }
}

function* updateWorkflowLabel({ labelName, labelIdentifier, identifier }) {
  const payload = {
    labelName,
    taskWorkflowIdentifier: identifier,
    labelIdentifier,
  };
  try {
    const updatedLabel = yield call(editLabel, payload);
    yield put({
      type: ActionTypes.UPDATE_WORKFLOW_LABEL_SUCCESS,
      updatedLabel,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: ActionTypes.UPDATE_WORKFLOW_LABEL_FAILURE, payload });
    yield put(showGlobalErrorAlert());
  }
}

function* removeLabelFromWorkflow({ labelIdentifier, identifier }) {
  const payload = {
    taskWorkflowIdentifier: identifier,
    labelIdentifier,
  };
  try {
    const updatedLabel = yield call(removeLabelForTask, payload);
    yield put({
      type: ActionTypes.REMOVE_WORKFLOW_LABEL_FROM_TASK_SUCCESS,
      updatedLabel,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({
      type: ActionTypes.REMOVE_WORKFLOW_LABEL_FROM_TASK_FAILURE,
      payload,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* removeLabel({ labelIdentifier }) {
  try {
    yield call(removeLabelFromDatabase, { labelIdentifier });
    yield put({
      type: ActionTypes.REMOVE_WORKFLOW_LABEL_SUCCESS,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: ActionTypes.REMOVE_WORKFLOW_LABEL_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchTaskTemplate() {
  yield takeLatest(
    ActionTypes.INITIALIZE_WORKFLOW_LIBRARY_STATE,
    initializeWorkflowLibraryState,
  );
  yield takeEvery(ActionTypes.MOVE_WORKFLOW_TO_FOLDER, moveWorkflowToFolder);
  yield takeEvery(ActionTypes.ADD_TASK_TEMPLATE, addTemplate);
  yield takeEvery(ActionTypes.ADD_TASK_TEMPLATE_FOLDER, addTemplate);
  yield takeLatest(ActionTypes.GET_WORKFLOW_FOLDER, getWorkflowFolder);
  yield takeLatest(ActionTypes.GET_FOLDER_BREADCRUMBS, getFolderBreadcrumbs);
  yield takeLatest(ActionTypes.GET_WORKFLOW_DETAILS, getWorkflowDetails);
  yield takeEvery(ActionTypes.TOGGLE_TASK_TEMPLATE_OPEN, toggleTemplateOpen);
  yield takeEvery(ActionTypes.UPDATE_PARTIAL_WORKFLOW, updatePartialWorkflow);

  yield takeEvery(
    ActionTypes.REORDER_TASKS_FOR_TEMPLATE,
    reorderTasksForTemplate,
  );
  yield takeLatest(
    ActionTypes.RELOAD_OPENED_TEMPLATE_TASKS,
    reloadOpenedTemplateTasks,
  );
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
  yield takeEvery(ActionTypes.CHANGE_TASK_INTENT_TYPE, changeTaskIntentType);
  yield takeEvery(ActionTypes.SWITCH_TEMPLATE_PUBLIC, switchTemplatePublic);
  yield takeEvery(ActionTypes.ADD_WORKFLOW_LABEL, addWorkflowLabel);
  yield takeEvery(ActionTypes.UPDATE_WORKFLOW_LABEL, updateWorkflowLabel);
  yield takeEvery(
    ActionTypes.REMOVE_WORKFLOW_LABEL_FROM_TASK,
    removeLabelFromWorkflow,
  );
  yield takeEvery(ActionTypes.REMOVE_WORKFLOW_LABEL, removeLabel);
}
