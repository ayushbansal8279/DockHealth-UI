/* eslint-disable require-yield */
/* eslint-disable no-console */
import {
  put,
  call,
  takeLatest,
  select,
  all,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import * as PatientTasksApi from 'api/patient-tasks-api';
import * as TaskListApi from 'api/task-list-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as TemplateBundleApi from 'api/template-bundle-api';
import * as PatientApi from 'api/patient-api';
import * as PatientLabelApi from 'api/patient-label-api';
import AlertMessages from 'alert/AlertMessages';
import {
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  UPDATE_PATIENT_TASK,
  FETCH_MEGA_FILTERS_SUCCESS,
  FETCH_MEGA_FILTERS_FAILURE,
  SET_PATIENT_TASK_SEARCH_VALUE,
  SORT_PATIENT_TASKS,
  ADD_TASK,
  UPDATE_PATIENT_DETAILS,
  ARCHIEVE_PATIENT,
} from 'actions/action-types';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  completeTasksVisibilitySelector,
  patientListHasTasksSelector,
  patientTasksSortSelector,
  patientSelector,
} from 'selectors/patient-details-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';
import {
  toggleTaskCompletedStatus,
  setDueDate as setDueDateHelper,
  setWorkflowStatus as setWorkflowStatusHelper,
  TASK_DISAPPEAR_DELAY,
} from 'helpers/task-update-helper';
import { locationParametersSelector } from 'location/selectors';
import {
  onSortChanged,
  onPatientNoteAdded,
  onPatientNoteEdited,
  onPatientDetailsEdited,
} from 'helpers/ga-event-helper';
import { closeModal } from 'modal/actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import { PATIENTS_LIST_ALL } from '../routing/helpers/paths';

export const DO_FETCH_STATS_FOR_PATIENT_TASKS =
  'DO_FETCH_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';
export const DO_REFRESH_PATIENT_TASKS = 'DO_REFRESH_PATIENT_TASKS';
export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';
export const DO_REASSIGN_TASK = 'DO_REASSIGN_TASK';
export const DO_UPDATE_DUE_DATE = 'DO_UPDATE_PATIENT_TASK_DUE_DATE';
export const DO_UPDATE_PATIENT_WORKFLOW_STATUS =
  'DO_UPDATE_PATIENT_WORKFLOW_STATUS';
export const DO_UPDATE_PATIENT_TASK = 'DO_UPDATE_PATIENT_TASK';
export const DO_QUICK_ADD_PATIENT_TASK = 'DO_QUICK_ADD_PATIENT_TASK';
export const DO_FETCH_PATIENT_FILTERS = 'DO_FETCH_PATIENT_FILTERS';
export const DO_UPDATE_PATIENT_TASKS_FILTERS =
  'DO_UPDATE_PATIENT_TASKS_FILTERS';
export const DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT =
  'DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT';
export const DO_SET_PATIENT_TASK_SEARCH_VALUE =
  'DO_SET_PATIENT_TASK_SEARCH_VALUE';
export const DO_INVITE_USER_TO_TASKLIST = 'DO_INVITE_USER_TO_TASKLIST';
export const DO_REMOVE_USER_FROM_TASKLIST = 'DO_REMOVE_USER_FROM_TASKLIST';
export const DO_CANCEL_USER_INVITE_TO_TASKLIST =
  'DO_CANCEL_USER_INVITE_TO_TASKLIST';
export const DO_CHANGE_MEMBER_ROLE = 'DO_CHANGE_MEMBER_ROLE';
export const DO_SORT_PATIENT_TASKS = 'DO_SORT_PATIENT_TASKS';
export const DO_APPLY_TEMPLATE_FOR_PATIENT = 'DO_APPLY_TEMPLATE_FOR_PATIENT';
export const DO_FETCH_PATIENT = 'DO_FETCH_PATIENT';
export const DO_FETCH_PATIENT_LABELS = 'DO_FETCH_PATIENT_LABELS';
export const DO_RELOAD_PATIENT = 'DO_RELOAD_PATIENT';
export const DO_TOGGLE_COMPLETE_TASKS_VISIBLE =
  'DO_TOGGLE_COMPLETE_TASKS_VISIBLE';
export const DO_UPDATE_PATIENT_NOTE = 'DO_UPDATE_PATIENT_NOTE';
export const DO_ADD_PATIENT_NOTE = 'DO_ADD_PATIENT_NOTE';
export const DO_REMOVE_PATIENT_NOTE = 'DO_REMOVE_PATIENT_NOTE';
export const DO_CHANGE_PATIENT_NOTE_PIN = 'DO_CHANGE_PATIENT_NOTE_PIN';

export const quickAddPatientTask = ({ description, taskListIdentifier }) => ({
  type: DO_QUICK_ADD_PATIENT_TASK,
  payload: {
    description,
    taskListIdentifier,
  },
});

export const fetchStatsForPatientTasks = () => ({
  type: DO_FETCH_STATS_FOR_PATIENT_TASKS,
});

export const fetchPatientFilters = patientIdentifier => ({
  type: DO_FETCH_PATIENT_FILTERS,
  patientIdentifier,
});

export const fetchPatientTasks = patientIdentifier => ({
  type: DO_FETCH_PATIENT_TASKS,
  patientIdentifier,
});

export const refreshPatientTasks = ({ withLoader }) => ({
  type: DO_REFRESH_PATIENT_TASKS,
  withLoader,
});

export const togglePatientTaskStatus = task => ({
  type: DO_TOGGLE_PATIENT_TASK_STATUS,
  payload: {
    task,
  },
});

export const updateTaskData = (taskIdentifier, newTaskData) => ({
  type: UPDATE_PATIENT_TASK,
  payload: {
    taskIdentifier,
    newTaskData,
  },
});

export const updatePatientTaskDueDate = (task, dueDate) => ({
  type: DO_UPDATE_DUE_DATE,
  payload: {
    task,
    dueDate,
  },
});

export const updatePatientTaskWorkflowStatus = (task, workflowStatus) => ({
  type: DO_UPDATE_PATIENT_WORKFLOW_STATUS,
  payload: {
    task,
    workflowStatus,
  },
});

export const updatePatientTaskInList = (taskIdentifier, dataToUpdate) => ({
  type: DO_UPDATE_PATIENT_TASK,
  payload: {
    taskIdentifier,
    dataToUpdate,
  },
});

export const patientTasksFilterChange = selectedFilters => ({
  type: DO_UPDATE_PATIENT_TASKS_FILTERS,
  payload: {
    selectedFilters,
  },
});

export const initializeSavedFilters = patientIdentifier => ({
  type: DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
  patientIdentifier,
});

export const setPatientTaskSearch = value => ({
  type: DO_SET_PATIENT_TASK_SEARCH_VALUE,
  payload: {
    value,
  },
});

export const inviteUserToTaskList = (taskListIdentifier, user) => ({
  type: DO_INVITE_USER_TO_TASKLIST,
  payload: {
    taskListIdentifier,
    user,
  },
});

export const removeUserFromTaskList = (taskListIdentifier, member) => ({
  type: DO_REMOVE_USER_FROM_TASKLIST,
  payload: {
    taskListIdentifier,
    member,
  },
});

export const cancelUserInviteToTaskList = (taskListIdentifier, userEmail) => ({
  type: DO_CANCEL_USER_INVITE_TO_TASKLIST,
  payload: {
    taskListIdentifier,
    userEmail,
  },
});

export const changeMemberRole = (taskListIdentifier, member, role) => ({
  type: DO_CHANGE_MEMBER_ROLE,
  payload: {
    taskListIdentifier,
    member,
    role,
  },
});

export const sortPatientTasks = (key, order) => ({
  type: DO_SORT_PATIENT_TASKS,
  payload: {
    key,
    order,
  },
});

export const applyTemplateForPatient = ({
  taskListIdentifier,
  taskTemplateIdentifier,
}) => ({
  type: DO_APPLY_TEMPLATE_FOR_PATIENT,
  taskListIdentifier,
  taskTemplateIdentifier,
});

export const fetchPatient = patientIdentifier => ({
  type: DO_FETCH_PATIENT,
  patientIdentifier,
});

export const fetchPatientLabels = () => ({
  type: DO_FETCH_PATIENT_LABELS,
});

export const reloadPatient = () => ({
  type: DO_RELOAD_PATIENT,
});

export const toggleCompleteTasksVisible = () => ({
  type: DO_TOGGLE_COMPLETE_TASKS_VISIBLE,
});

export const updatePatientNote = note => ({
  type: DO_UPDATE_PATIENT_NOTE,
  note,
});

export const addPatientNote = (patientIdentifier, note) => ({
  type: DO_ADD_PATIENT_NOTE,
  patientIdentifier,
  note,
});

export const removePatientNote = patientNoteIdentifier => ({
  type: DO_REMOVE_PATIENT_NOTE,
  patientNoteIdentifier,
});

export const changePatientNotePin = (patientNoteIdentifier, pinned) => ({
  type: DO_CHANGE_PATIENT_NOTE_PIN,
  patientNoteIdentifier,
  pinned,
});

export const PatientTasksSagaActions = {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  refreshPatientTasks,
  togglePatientTaskStatus,
  updateTaskData,
  updatePatientTaskDueDate,
  updatePatientTaskWorkflowStatus,
  quickAddPatientTask,
  patientTasksFilterChange,
  initializeSavedFilters,
  setPatientTaskSearch,
  inviteUserToTaskList,
  removeUserFromTaskList,
  cancelUserInviteToTaskList,
  changeMemberRole,
  fetchPatientFilters,
  sortPatientTasks,
  updatePatientTaskInList,
  applyTemplateForPatient,
  toggleCompleteTasksVisible,
};

function* getPatientLists(patientIdentifier) {
  const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
  const completeTasksVisible = yield select(completeTasksVisibilitySelector);
  const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';
  const sort = yield select(patientTasksSortSelector);

  let lists;

  if (!selectedFilters || !isEmpty(selectedFilters)) {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifierWithFilters,
      patientIdentifier,
      sort,
      selectedFilters,
      status,
    );
  } else {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifier,
      patientIdentifier,
      sort,
      status,
    );
  }
  return lists;
}

function* doFetchPatientTasks({ patientIdentifier }) {
  try {
    yield put({ type: REQUEST_PATIENT_TASKS });
    const lists = yield getPatientLists(patientIdentifier);
    yield put({
      type: REQUEST_PATIENT_TASKS_SUCCESS,
      payload: { lists },
    });
  } catch (error) {
    yield put({
      type: REQUEST_PATIENT_TASKS_FAILURE,
    });
  }
}

function* doRefreshPatientTasks({ withLoader }) {
  try {
    if (withLoader) {
      yield put({ type: REQUEST_PATIENT_TASKS });
    }
    const { patientIdentifier } = yield select(locationParametersSelector);
    const lists = yield getPatientLists(patientIdentifier);

    yield put(fetchPatientFilters(patientIdentifier));
    yield put({
      type: REQUEST_PATIENT_TASKS_SUCCESS,
      payload: { lists },
    });
  } catch (error) {
    yield put({
      type: REQUEST_PATIENT_TASKS_FAILURE,
    });
  }
}

function* doFetchStatsForPatientTasks() {
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);
    const stats = yield call(
      PatientTasksApi.fetchStatsForPatientTasks,
      patientIdentifier,
    );
    const successPayload = {};
    successPayload.incompleteTasksCount = stats.find(
      stat => stat.metricName === 'INCOMPLETE_TASKS_COUNT',
    )?.metricValue;
    successPayload.completeTasksCount = stats.find(
      stat => stat.metricName === 'COMPLETE_TASKS_COUNT',
    )?.metricValue;

    yield put({ type: REQUEST_PATIENT_STATS_SUCCESS, payload: successPayload });
  } catch (error) {
    yield put({ type: REQUEST_PATIENT_STATS_FAILURE });
  }
}

function* doFetchPatientFilters({ patientIdentifier }) {
  const completeTasksVisible = yield select(completeTasksVisibilitySelector);
  const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';

  try {
    const filters = yield call(
      PatientTasksApi.fetchPatientFilters,
      patientIdentifier,
      status,
    );
    yield put({
      type: FETCH_MEGA_FILTERS_SUCCESS,
      filters,
    });
  } catch (error) {
    yield put({
      type: FETCH_MEGA_FILTERS_FAILURE,
    });
  }
}

function* doToggleTaskCompleteStatus({ payload }) {
  const { task } = payload;

  try {
    const currentUser = yield select(userProfileSelector);

    const updatedTask = toggleTaskCompletedStatus(task, currentUser);

    const { apiEndpoint, successMessage } =
      updatedTask.status === 'COMPLETE'
        ? {
            apiEndpoint: 'markComplete',
            successMessage: AlertMessages.TASK_COMPLETED,
          }
        : {
            apiEndpoint: 'markIncomplete',
            successMessage: AlertMessages.TASK_REACTIVATED,
          };
    yield put(updateTaskData(updatedTask.taskIdentifier, updatedTask));

    yield call(TaskApi[apiEndpoint], task);
    yield put(AlertActions.showGlobalAlert(successMessage));

    yield delay(TASK_DISAPPEAR_DELAY);
    if (!task.parentTaskIdentifier) {
      yield put(refreshPatientTasks({ withLoader: false }));
    }
    yield put(fetchStatsForPatientTasks());
  } catch (error) {
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  }
}

function* doUpdateDueDate({ payload }) {
  const { task, dueDate } = payload;

  try {
    const updatedTask = setDueDateHelper(task, dueDate);
    yield put(updateTaskData(task?.taskIdentifier, updatedTask));

    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  } catch (error) {
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  }
}

function* doUpdatePatientTaskWorkflowStatus({ payload }) {
  const { workflowStatus, task } = payload;
  try {
    const updatedTask = setWorkflowStatusHelper(task, workflowStatus);
    yield put(updateTaskData(task?.taskIdentifier, updatedTask));

    yield call(
      TaskApi.updateWorkflowStatus,
      task.taskIdentifier,
      workflowStatus,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  } catch (error) {
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  }
}

function* doUpdatePatientTaskInList({ payload }) {
  const { taskIdentifier, dataToUpdate } = payload;

  try {
    yield put(updateTaskData(taskIdentifier, dataToUpdate));
    yield call(TaskApi.partialUpdateTask, taskIdentifier, dataToUpdate);
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  } catch (error) {
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  }
}

function* doQuickAddPatientTask({ payload }) {
  const { description, taskListIdentifier } = payload;

  try {
    const { patientIdentifier } = yield select(locationParametersSelector);

    const isFirstTask = !(yield select(patientListHasTasksSelector));

    if (isFirstTask) {
      yield put({ type: REQUEST_PATIENT_TASKS });
    }

    const addedTask = yield call(TaskApi.addTask, {
      description,
      taskListIdentifier,
      patientIdentifier,
    });
    yield put({ type: ADD_TASK, task: addedTask });
    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
    yield put(fetchStatsForPatientTasks());
  } catch (error) {
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  }
}

function* doUpdatePatientTasksFilters({ payload }) {
  try {
    const { selectedFilters } = payload;
    const { patientIdentifier } = yield select(locationParametersSelector);
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';

    yield put(
      MegaFilterActions.selectFiltersForMegaFilter(
        selectedFilters,
        patientIdentifier,
        status,
      ),
    );
    yield put(refreshPatientTasks({ withLoader: true }));
  } catch (error) {
    console.log(error);
  }
}

function* doInitializeSavedFiltersForPatient({ patientIdentifier }) {
  try {
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';
    yield put(
      MegaFilterActions.selectFiltersFromLocalStorage(
        patientIdentifier,
        status,
      ),
    );
  } catch (error) {
    console.log(error);
  }
}

function* doSetPatientTaskSearch({ payload }) {
  try {
    yield put({ type: SET_PATIENT_TASK_SEARCH_VALUE, payload });
  } catch (error) {
    console.log(error);
  }
}

function* doInviteUserToTaskList({ payload }) {
  const {
    taskListIdentifier,
    user: { userIdentifier },
  } = payload;
  try {
    yield call(
      TaskListApi.inviteUserToTaskList,
      taskListIdentifier,
      userIdentifier,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(refreshPatientTasks({ withLoader: false }));
  } catch (error) {
    yield put(refreshPatientTasks({ withLoader: false }));
  }
}

function* doRemoveUserFromTaskList({ payload }) {
  const { taskListIdentifier, member } = payload;
  try {
    yield call(TaskListApi.removeUserFromTaskList, taskListIdentifier, member);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(refreshPatientTasks({ withLoader: false }));
  } catch (error) {
    yield put(refreshPatientTasks({ withLoader: false }));
  }
}

function* doCancelUserInviteToTaskList({ payload }) {
  const { taskListIdentifier, userEmail } = payload;
  try {
    yield call(
      TaskListApi.cancelInviteToTaskList,
      taskListIdentifier,
      userEmail,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(refreshPatientTasks({ withLoader: false }));
  } catch (error) {
    yield put(refreshPatientTasks({ withLoader: false }));
  }
}

function* doChangeMemberRole({ payload }) {
  const { taskListIdentifier, member, role } = payload;
  try {
    yield call(
      TaskListApi.changeUserRoleForList,
      taskListIdentifier,
      member.userIdentifier,
      role,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(refreshPatientTasks({ withLoader: false }));
  } catch (error) {
    yield put(refreshPatientTasks({ withLoader: false }));
  }
}

function* doSortPatientTasks({ payload }) {
  try {
    const { key, order } = payload;
    onSortChanged(order ? key : null, order);

    yield put({
      type: SORT_PATIENT_TASKS,
      payload: {
        key: order ? key : null,
        order,
      },
    });
    yield put(refreshPatientTasks({ withLoader: true }));
  } catch (error) {
    console.log(error);
  }
}

function* doApplyTemplateForPatient({
  taskTemplateIdentifier,
  taskListIdentifier,
}) {
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);
    yield call(TemplateBundleApi.applyTemplate, {
      taskTemplateIdentifier,
      taskListIdentifier,
      patientIdentifier,
    });
    yield all([
      put(refreshPatientTasks({ withLoader: false })),
      put(fetchStatsForPatientTasks()),
    ]);
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* doFetchPatient({ patientIdentifier }) {
  try {
    yield put(PatientDetailsActions.initializePatient(patientIdentifier));
    yield put(PatientDetailsActions.setPatientFetching());
    const patient = yield call(PatientApi.getPatientById, patientIdentifier);
    yield put(PatientDetailsActions.setPatient(patient));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* doFetchPatientLabels() {
  try {
    yield put(PatientDetailsActions.setPatientLabelsFetching());
    const labels = yield call(PatientLabelApi.getAllPatientLabels);
    yield put(PatientDetailsActions.setPatientLabels(labels));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* doReloadPatient() {
  try {
    const currentPatient = yield select(patientSelector);
    if (currentPatient?.patientIdentifier) {
      const patient = yield call(
        PatientApi.getPatientById,
        currentPatient.patientIdentifier,
      );
      yield put(PatientDetailsActions.setPatient(patient));
    }
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* doUpdatePatientNote({ note }) {
  try {
    onPatientNoteEdited();
    yield put(
      PatientDetailsActions.updatePatientNote(note.patientNoteIdentifier, note),
    );
    const updatedNote = yield call(PatientApi.updatePatientNote, note);
    yield put(
      PatientDetailsActions.updatePatientNote(
        note.patientNoteIdentifier,
        updatedNote,
      ),
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(reloadPatient());
  }
}

function* doUpdatePatientDetails({ payload: { details } }) {
  try {
    onPatientDetailsEdited();
    yield call(PatientApi.updatePatient, details);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(reloadPatient());
  }
}

function* doArchievePatient({ payload: { patientIdentifier, history } }) {
  try {
    yield call(PatientApi.archivePatient, patientIdentifier);
    yield put(closeModal());
    yield put(showGlobalAlert(AlertMessages.PATIENT_ARCHIVED));
    history.push(PATIENTS_LIST_ALL);
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put(closeModal());
  }
}

function* doAddPatientNote({ patientIdentifier, note }) {
  try {
    onPatientNoteAdded();
    const newNote = yield call(
      PatientApi.createPatientNote,
      patientIdentifier,
      { description: note },
    );
    yield put(PatientDetailsActions.addPatientNote(newNote));
    yield put(AlertActions.showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(reloadPatient());
  }
}

function* doRemovePatientNote({ patientNoteIdentifier }) {
  try {
    yield put(PatientDetailsActions.deletePatientNote(patientNoteIdentifier));
    yield call(PatientApi.deletePatientNote, patientNoteIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(reloadPatient());
  }
}

function* doChangePatientNotePin({ patientNoteIdentifier, pinned }) {
  try {
    const updatedNote = yield call(
      PatientApi.changePatientNotePinnedFlag,
      patientNoteIdentifier,
      pinned,
    );
    yield put(
      PatientDetailsActions.updatePatientNote(
        patientNoteIdentifier,
        updatedNote,
      ),
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(reloadPatient());
  }
}

function* doToggleCompleteTasksVisible() {
  try {
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    yield put(
      PatientDetailsActions.setCompleteTasksVisibility(!completeTasksVisible),
    );
    yield put(refreshPatientTasks({ withLoader: true }));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

export default function* watchPatientDetails() {
  yield takeLatest(
    DO_FETCH_STATS_FOR_PATIENT_TASKS,
    doFetchStatsForPatientTasks,
  );
  yield takeLatest(DO_FETCH_PATIENT_TASKS, doFetchPatientTasks);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_STATUS, doToggleTaskCompleteStatus);
  yield takeLatest(DO_REFRESH_PATIENT_TASKS, doRefreshPatientTasks);
  yield takeLatest(DO_UPDATE_DUE_DATE, doUpdateDueDate);
  yield takeLatest(
    DO_UPDATE_PATIENT_WORKFLOW_STATUS,
    doUpdatePatientTaskWorkflowStatus,
  );
  yield takeLatest(DO_UPDATE_PATIENT_TASK, doUpdatePatientTaskInList);
  yield takeEvery(DO_QUICK_ADD_PATIENT_TASK, doQuickAddPatientTask);
  yield takeLatest(DO_FETCH_PATIENT_FILTERS, doFetchPatientFilters);
  yield takeLatest(
    DO_UPDATE_PATIENT_TASKS_FILTERS,
    doUpdatePatientTasksFilters,
  );
  yield takeLatest(
    DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
    doInitializeSavedFiltersForPatient,
  );
  yield takeLatest(DO_SET_PATIENT_TASK_SEARCH_VALUE, doSetPatientTaskSearch);
  yield takeEvery(DO_INVITE_USER_TO_TASKLIST, doInviteUserToTaskList);
  yield takeEvery(DO_REMOVE_USER_FROM_TASKLIST, doRemoveUserFromTaskList);
  yield takeEvery(
    DO_CANCEL_USER_INVITE_TO_TASKLIST,
    doCancelUserInviteToTaskList,
  );
  yield takeEvery(DO_CHANGE_MEMBER_ROLE, doChangeMemberRole);
  yield takeEvery(DO_SORT_PATIENT_TASKS, doSortPatientTasks);
  yield takeEvery(DO_APPLY_TEMPLATE_FOR_PATIENT, doApplyTemplateForPatient);
  yield takeLatest(DO_FETCH_PATIENT, doFetchPatient);
  yield takeLatest(DO_FETCH_PATIENT_LABELS, doFetchPatientLabels);
  yield takeLatest(DO_RELOAD_PATIENT, doReloadPatient);
  yield takeLatest(
    DO_TOGGLE_COMPLETE_TASKS_VISIBLE,
    doToggleCompleteTasksVisible,
  );
  yield takeEvery(DO_UPDATE_PATIENT_NOTE, doUpdatePatientNote);
  yield takeEvery(UPDATE_PATIENT_DETAILS, doUpdatePatientDetails);
  yield takeEvery(ARCHIEVE_PATIENT, doArchievePatient);
  yield takeEvery(DO_ADD_PATIENT_NOTE, doAddPatientNote);
  yield takeEvery(DO_REMOVE_PATIENT_NOTE, doRemovePatientNote);
  yield takeEvery(DO_CHANGE_PATIENT_NOTE_PIN, doChangePatientNotePin);
}
