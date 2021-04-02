import {
  ADD_TASK_TEMPLATE,
  DELETE_TASK_TEMPLATE,
  DUPLICATE_TASK_TEMPLATE,
  GET_TASK_TEMPLATES,
  TOGGLE_TASK_TEMPLATE_OPEN,
  UPDATE_TASK_TEMPLATE,
} from 'actions/action-types-saga';
import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import * as ActionTypes from 'actions/action-types';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as TaskTemplateApi from 'api/task-template-api';
import {
  taskTemplateDetailsSelector,
  taskTemplateSelector,
} from 'selectors/task-template-selectors';
import { omit } from 'ramda';

function* getTemplates() {
  try {
    yield put({
      type: ActionTypes.TASK_TEMPLATES_FETCHING,
    });
    const templates = yield call(TaskTemplateApi.getTemplates);
    yield put({
      type: ActionTypes.LOAD_TASK_TEMPLATES,
      templates: templates.reverse(),
    });
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

function* duplicateTemplate({ taskTemplateIdentifier }) {
  try {
    const template = yield call(
      TaskTemplateApi.duplicateTemplate,
      taskTemplateIdentifier,
    );
    yield put({ type: ActionTypes.ADD_TASK_TEMPLATE, template });
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
    yield put({
      type: ActionTypes.TASK_TEMPLATE_FETCHING,
      taskTemplateIdentifier,
    });
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
        ? call(getTasksForTemplate, { taskTemplateIdentifier })
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

export default function* watchTaskTemplate() {
  yield takeEvery(ADD_TASK_TEMPLATE, addTemplate);
  yield takeEvery(DELETE_TASK_TEMPLATE, deleteTemplate);
  yield takeLatest(GET_TASK_TEMPLATES, getTemplates);
  yield takeEvery(TOGGLE_TASK_TEMPLATE_OPEN, toggleTemplateOpen);
  yield takeEvery(UPDATE_TASK_TEMPLATE, updateTemplate);
  yield takeEvery(DUPLICATE_TASK_TEMPLATE, duplicateTemplate);
}
