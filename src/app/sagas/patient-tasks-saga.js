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
import * as TaskListApi from 'api/tasklist-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
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
} from 'actions/action-types';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

import { userProfileSelector } from 'selectors/user-selectors';
import {
  patientTaskListsActiveTabSelector,
  currentPatientIdentifierSelector,
  patientListHasTasksSelector,
} from 'selectors/patient-tasks-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';
import {
  toggleTaskPriority,
  toggleTaskCompletedStatus,
  assignTask as assignTaskHelper,
  setDueDate as setDueDateHelper,
  setWorkflowStatus as setWorkflowStatusHelper,
  TASK_DISAPPEAR_DELAY,
} from 'helpers/task-update-helper';

export const DO_FETCH_STATS_FOR_PATIENT_TASKS =
  'DO_FETCH_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';
export const DO_REFRESH_PATIENT_TASKS = 'DO_REFRESH_PATIENT_TASKS';
export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';
export const DO_TOGGLE_PATIENT_TASK_PRIORITY =
  'DO_TOGGLE_PATIENT_TASK_PRIORITY';
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

export const quickAddPatientTask = (description, taskListIdentifier) => ({
  type: DO_QUICK_ADD_PATIENT_TASK,
  payload: {
    description,
    taskListIdentifier,
  },
});

export const fetchStatsForPatientTasks = () => ({
  type: DO_FETCH_STATS_FOR_PATIENT_TASKS,
});

export const fetchPatientFilters = () => ({
  type: DO_FETCH_PATIENT_FILTERS,
});

export const fetchPatientTasks = () => ({
  type: DO_FETCH_PATIENT_TASKS,
});

export const refreshPatientTasks = () => ({
  type: DO_REFRESH_PATIENT_TASKS,
});

export const togglePatientTaskStatus = task => ({
  type: DO_TOGGLE_PATIENT_TASK_STATUS,
  payload: {
    task,
  },
});

export const togglePatientTaskPriority = task => ({
  type: DO_TOGGLE_PATIENT_TASK_PRIORITY,
  payload: { task },
});

export const updatePatientTask = (taskIdentifier, newTaskData) => ({
  type: UPDATE_PATIENT_TASK,
  payload: {
    taskIdentifier,
    newTaskData,
  },
});

export const reassignPatientTask = (task, assignee) => ({
  type: DO_REASSIGN_TASK,
  payload: {
    task,
    assignee,
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

export const updatePatientTaskInList = task => ({
  type: DO_UPDATE_PATIENT_TASK,
  payload: {
    task,
  },
});

export const patientTasksFilterChange = selectedFilters => ({
  type: DO_UPDATE_PATIENT_TASKS_FILTERS,
  payload: {
    selectedFilters,
  },
});

export const initalizeSavedFilters = () => ({
  type: DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
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

export const PatientTasksSagaActions = {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  refreshPatientTasks,
  togglePatientTaskStatus,
  togglePatientTaskPriority,
  updatePatientTask,
  reassignPatientTask,
  updatePatientTaskDueDate,
  updatePatientTaskWorkflowStatus,
  quickAddPatientTask,
  patientTasksFilterChange,
  initalizeSavedFilters,
  setPatientTaskSearch,
  inviteUserToTaskList,
  removeUserFromTaskList,
  cancelUserInviteToTaskList,
  changeMemberRole,
};

function* getPatientLists() {
  const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  let lists;
  if (!selectedFilters || !isEmpty(selectedFilters)) {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifierWithFilters,
      patientIdentifier,
      selectedFilters,
      status,
    );
  } else {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifier,
      patientIdentifier,
      status,
    );
  }
  return lists;
}

function* doFetchPatientTasks() {
  try {
    yield put({ type: REQUEST_PATIENT_TASKS });
    const lists = yield getPatientLists();
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

function* doRefreshPatientTasks() {
  try {
    const lists = yield getPatientLists();

    yield put(fetchPatientFilters());
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
    const patientIdentifier = yield select(currentPatientIdentifierSelector);

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

function* doFetchPatientFilters() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

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
    yield put(updatePatientTask(updatedTask.taskIdentifier, updatedTask));

    yield call(TaskApi[apiEndpoint], task);
    yield put(AlertActions.showGlobalAlert(successMessage));

    yield delay(TASK_DISAPPEAR_DELAY);
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doToggleTaskPriority({ payload }) {
  const { task } = payload;

  const updatedTask = toggleTaskPriority(task);

  const apiEndpoint =
    updatedTask.priority === 'HIGH' ? 'markHighPriority' : 'markLowPriority';

  try {
    yield put(updatePatientTask(updatedTask.taskIdentifier, updatedTask));

    yield call(TaskApi[apiEndpoint], updatedTask.taskIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doReassignTask({ payload }) {
  const { assignee, task } = payload;

  try {
    const currentUser = yield select(userProfileSelector);
    const updatedTask = assignTaskHelper(task, assignee, currentUser);
    yield put(updatePatientTask(updatedTask.taskIdentifier, updatedTask));
    yield call(
      TaskApi.assignOrReassignTask,
      { taskIdentifier: task.taskIdentifier },
      assignee?.userIdentifier,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdateDueDate({ payload }) {
  const { task, dueDate } = payload;

  try {
    const updatedTask = setDueDateHelper(task, dueDate);
    yield put(updatePatientTask(task?.taskIdentifier, updatedTask));

    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdatePatientTaskWorkflowStatus({ payload }) {
  const { workflowStatus, task } = payload;
  try {
    const updatedTask = setWorkflowStatusHelper(task, workflowStatus);
    yield put(updatePatientTask(task?.taskIdentifier, updatedTask));

    yield call(
      TaskApi.updateWorkflowStatus,
      task.taskIdentifier,
      workflowStatus,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdatePatientTaskInList({ payload }) {
  const { task } = payload;

  try {
    yield put(updatePatientTask(task?.taskIdentifier, task));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doQuickAddPatientTask({ payload }) {
  const { description, taskListIdentifier } = payload;

  try {
    const patientIdentifier = yield select(currentPatientIdentifierSelector);

    const isFirstTask = !(yield select(patientListHasTasksSelector));

    if (isFirstTask) {
      yield put({ type: REQUEST_PATIENT_TASKS });
    }

    yield call(TaskApi.addTask, {
      description,
      taskListIdentifier,
      patientIdentifier,
    });
    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdatePatientTasksFilters({ payload }) {
  const { selectedFilters } = payload;
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      selectedFilters,
      patientIdentifier,
      status,
    ),
  );
  yield put(refreshPatientTasks());
}

function* doInitializeSavedFiltersForPatient() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';
  yield put(
    MegaFilterActions.selectFiltersFromLocalStorage(patientIdentifier, status),
  );
}

function* doSetPatientTaskSearch({ payload }) {
  yield put({ type: SET_PATIENT_TASK_SEARCH_VALUE, payload });
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
    yield put(refreshPatientTasks());
  } catch (error) {
    yield put(refreshPatientTasks());
  }
}

function* doRemoveUserFromTaskList({ payload }) {
  const { taskListIdentifier, member } = payload;
  try {
    yield call(TaskListApi.removeUserFromTaskList, taskListIdentifier, member);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(refreshPatientTasks());
  } catch (error) {
    yield put(refreshPatientTasks());
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
    yield put(refreshPatientTasks());
  } catch (error) {
    yield put(refreshPatientTasks());
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
    yield put(refreshPatientTasks());
  } catch (error) {
    yield put(refreshPatientTasks());
  }
}

export default function* watchPatientTasks() {
  yield takeLatest(
    DO_FETCH_STATS_FOR_PATIENT_TASKS,
    doFetchStatsForPatientTasks,
  );
  yield takeLatest(DO_FETCH_PATIENT_TASKS, doFetchPatientTasks);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_STATUS, doToggleTaskCompleteStatus);
  yield takeLatest(DO_REFRESH_PATIENT_TASKS, doRefreshPatientTasks);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_PRIORITY, doToggleTaskPriority);
  yield takeLatest(DO_REASSIGN_TASK, doReassignTask);
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
}
