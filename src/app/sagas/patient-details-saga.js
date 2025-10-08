import {
  all,
  put,
  call,
  takeLatest,
  select,
  takeEvery,
  takeLeading,
  delay,
} from 'redux-saga/effects';
import isEmpty from 'ramda/src/isEmpty';
import * as ActionTypes from 'actions/action-types';
import * as PatientTasksApi from 'api/patient-tasks-api';
import * as TaskListApi from 'api/task-list-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as PatientApi from 'api/patient-api';
import * as PatientLabelApi from 'api/patient-label-api';
import * as PatientAttachmentApi from 'api/patient-attachment-api';
import AlertMessages from 'alert/AlertMessages';
import * as PatientDetailsActions from 'actions/patient-details-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  completeTasksVisibilitySelector,
  patientTasksSortSelector,
  currentPatientIdentifierSelector,
  currentFolderIdentifierSelector,
  currentListTasksStatusSelector,
} from 'selectors/patient-details-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  toggleTaskCompletedStatus,
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
import { log } from 'helpers/log';
import {
  cleanedSelectedFilters,
  getFiltersStorageKey,
  getQuickFilterStorageKey,
  getSortStorageKey,
} from 'helpers/mega-filter-helper';
import { PATIENTS_LIST_ALL } from '../routing/helpers/paths';
import localStorageHelper from '../helpers/local-storage-helper';
import sessionStorageHelper from '../helpers/session-storage-helper';
import { UserPreferenceContextType } from '../helpers/user-prefrence-helper';
import {
  userPreferenceSelectedFiltersSelector,
  userPreferenceSelectedQuickFilterSelector,
  userPreferenceStatusSelector,
} from '@/app/selectors/user-preference-selectors';
import * as UserPreferenceApi from '@/app/api/user-preference-api';

export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';
export const DO_REASSIGN_TASK = 'DO_REASSIGN_TASK';
export const DO_UPDATE_DUE_DATE = 'DO_UPDATE_PATIENT_TASK_DUE_DATE';
export const DO_UPDATE_PATIENT_WORKFLOW_STATUS =
  'DO_UPDATE_PATIENT_WORKFLOW_STATUS';
export const DO_UPDATE_PATIENT_TASK = 'DO_UPDATE_PATIENT_TASK';
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
export const DO_FETCH_PATIENT_ATTACHMENTS = 'DO_FETCH_PATIENT_ATTACHMENTS';
export const DO_UPDATE_PATIENT_NOTE = 'DO_UPDATE_PATIENT_NOTE';
export const DO_ADD_PATIENT_NOTE = 'DO_ADD_PATIENT_NOTE';
export const DO_REMOVE_PATIENT_NOTE = 'DO_REMOVE_PATIENT_NOTE';
export const DO_CHANGE_PATIENT_NOTE_PIN = 'DO_CHANGE_PATIENT_NOTE_PIN';
export const DO_ARCHIVE_PATIENT = 'DO_ARCHIVE_PATIENT';
export const DO_UNARCHIVE_PATIENT = 'DO_UNARCHIVE_PATIENT';
export const DO_DELETE_PATIENT_ARCHIVE = 'DO_DELETE_PATIENT_ARCHIVE';

export const togglePatientTaskStatus = (task) => ({
  type: DO_TOGGLE_PATIENT_TASK_STATUS,
  payload: {
    task,
  },
});

export const updateTaskData = (taskIdentifier, newTaskData) => ({
  type: ActionTypes.UPDATE_PATIENT_TASK,
  payload: {
    taskIdentifier,
    newTaskData,
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

export const initializeSavedFilters = (patientIdentifier) => ({
  type: DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
  patientIdentifier,
});

export const setPatientTaskSearch = (value) => ({
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

export const updatePatientNote = (note) => ({
  type: DO_UPDATE_PATIENT_NOTE,
  note,
});

export const addPatientNote = (patientIdentifier, note) => ({
  type: DO_ADD_PATIENT_NOTE,
  patientIdentifier,
  note,
});

export const removePatientNote = (patientNoteIdentifier) => ({
  type: DO_REMOVE_PATIENT_NOTE,
  patientNoteIdentifier,
});

export const changePatientNotePin = (patientNoteIdentifier, pinned) => ({
  type: DO_CHANGE_PATIENT_NOTE_PIN,
  patientNoteIdentifier,
  pinned,
});

export const archivePatient = (patientIdentifier, history) => ({
  type: DO_ARCHIVE_PATIENT,
  payload: { patientIdentifier, history },
});

export const unarchivePatient = (patientIdentifier, history) => ({
  type: DO_UNARCHIVE_PATIENT,
  payload: { patientIdentifier, history },
});

export const deletePatientArchive = (patientIdentifier, history) => ({
  type: DO_DELETE_PATIENT_ARCHIVE,
  payload: { patientIdentifier, history },
});

export const PatientTasksSagaActions = {
  togglePatientTaskStatus,
  updateTaskData,
  updatePatientTaskWorkflowStatus,
  initializeSavedFilters,
  setPatientTaskSearch,
  inviteUserToTaskList,
  removeUserFromTaskList,
  cancelUserInviteToTaskList,
  changeMemberRole,
  sortPatientTasks,
  updatePatientTaskInList,
};

function* initializePatientState() {
  try {
    yield put(PatientDetailsActions.getCurrentPatient());
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* initializePatientAttachmentFolder() {
  yield put(PatientDetailsActions.getCurrentPatientAttachments());
}

function* getCurrentPatient() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);

  try {
    const patient = yield call(PatientApi.getPatientById, patientIdentifier);
    yield put({ type: ActionTypes.GET_CURRENT_PATIENT_SUCCESS, patient });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_FAILURE,
      patientIdentifier,
    });
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* getCurrentPatientLabels() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);

  try {
    const labels = yield call(PatientLabelApi.getAllPatientLabels);
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_LABELS_SUCCESS,
      labels,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_LABELS_FAILURE,
      patientIdentifier,
    });
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* getCurrentPatientAttachments() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const folderIdentifier = yield select(currentFolderIdentifierSelector);

  try {
    if (patientIdentifier) {
      const attachments = yield call(
        PatientAttachmentApi.getPatientAttachments,
        patientIdentifier,
        folderIdentifier,
      );
      const patientTaskAttachments = yield call(
        PatientAttachmentApi.getTaskAndWorkflowAttachmentsForPatient,
        patientIdentifier,
      );
      yield put({
        type: ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS_SUCCESS,
        attachments,
        patientTaskAttachments,
      });
    }
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS_FAILURE,
      patientIdentifier,
    });
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* getCurrentPatientTasks({ payload }) {
  try {
    const { taskStatus } = payload;
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    const sort = yield select(patientTasksSortSelector);
    const patientIdentifier = yield select(currentPatientIdentifierSelector);

    const preferences = yield call(
      UserPreferenceApi.getUserPreference,
      UserPreferenceContextType.PATIENT_LIST,
      'patient',
    );
    yield put({
      type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
      preferences,
    });
    const savedStatus = yield select(userPreferenceStatusSelector);
    
    const status = taskStatus || savedStatus;

    const lists = yield selectedFilters && !isEmpty(selectedFilters)
      ? call(
          PatientTasksApi.fetchPatientTasksByPatientIdentifierWithFilters,
          patientIdentifier,
          sort,
          selectedFilters,
          status,
        )
      : call(
          PatientTasksApi.fetchPatientTasksByPatientIdentifier,
          patientIdentifier,
          sort,
          status,
        );

    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_TASKS_SUCCESS,
      lists,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENT_TASKS_FAILURE,
    });
  }
}

function* getPatientFilterOptions() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);

  try {
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    const filters = yield call(
      PatientTasksApi.getPatientFilters,
      patientIdentifier,
      status,
      selectedFilters,
    );
    yield put({
      type: ActionTypes.GET_PATIENT_FILTER_OPTIONS_SUCCESS,
      filters,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_PATIENT_FILTER_OPTIONS_FAILURE,
      patientIdentifier,
    });
  }
}

function* getPatientTasksStats() {
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);
    const stats = yield call(
      PatientTasksApi.getPatientTasksStats,
      patientIdentifier,
    );
    const successPayload = {};
    successPayload.incompleteTasksCount = stats.find(
      (stat) => stat.metricName === 'INCOMPLETE_TASKS_COUNT',
    )?.metricValue;
    successPayload.completeTasksCount = stats.find(
      (stat) => stat.metricName === 'COMPLETE_TASKS_COUNT',
    )?.metricValue;

    yield put({
      type: ActionTypes.GET_PATIENT_TASKS_STATS_SUCCESS,
      payload: successPayload,
    });
  } catch {
    yield put({ type: ActionTypes.GET_PATIENT_TASKS_STATS_FAILURE });
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
      yield put(PatientDetailsActions.getCurrentPatientTasks());
    }
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
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
      workflowStatus?.identifier,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  }
}

function* doUpdatePatientTaskInList({ payload }) {
  const { taskIdentifier, dataToUpdate } = payload;

  try {
    yield put(updateTaskData(taskIdentifier, dataToUpdate));
    yield call(TaskApi.partialUpdateTask, taskIdentifier, dataToUpdate);
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  }
}

function* changePatientTasksFilters({ selectedFilters, selectedQuickFilter }) {
  try {
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';

    const newFilters = cleanedSelectedFilters(selectedFilters);

    const partialDetails = {
      selectedFilters: newFilters,
      selectedQuickFilter,
    };

    const preferences = yield call(
      UserPreferenceApi.updateUserPreference,
      UserPreferenceContextType.PATIENT_LIST,
      'patient',
      partialDetails,
    );

    yield put({
      type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
      preferences,
    });

    yield put(
      MegaFilterActions.selectFiltersForMegaFilter(
        newFilters,
        'patient',
        status,
        selectedQuickFilter,
      ),
    );
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch (error) {
    log(error);
  }
}

function* doInitializeSavedFiltersForPatient({ patientIdentifier }) {
  try {
    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';

    const preferences = yield call(
      UserPreferenceApi.getUserPreference,
      UserPreferenceContextType.PATIENT_LIST,
      'patient',
    );
    yield put({
      type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
      preferences,
    });

    const selectedFilters = yield select(userPreferenceSelectedFiltersSelector);
    const selectedQuickFilter = yield select(
      userPreferenceSelectedQuickFilterSelector,
    );

    let sort = localStorageHelper.getItem(getSortStorageKey('patient', status));

    if (sort && sort.key && sort.order) {
      yield put({
        type: ActionTypes.SORT_PATIENT_TASKS,
        payload: {
          key: sort.key,
          order: sort.order,
        },
      });
    }

    yield put(
      MegaFilterActions.selectFiltersForMegaFilter(
        selectedFilters,
        'patient',
        status,
        selectedQuickFilter,
      ),
    );
  } catch (error) {
    log(error);
  }
}

function* doSetPatientTaskSearch({ payload }) {
  try {
    yield put({ type: ActionTypes.SET_PATIENT_TASK_SEARCH_VALUE, payload });
  } catch (error) {
    log(error);
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
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  }
}

function* doRemoveUserFromTaskList({ payload }) {
  const { taskListIdentifier, member } = payload;
  try {
    yield call(TaskListApi.removeUserFromTaskList, taskListIdentifier, member);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
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
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
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
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  }
}

function* doSortPatientTasks({ payload }) {
  try {
    const { key, order } = payload;
    onSortChanged(order ? key : null, order);

    const completeTasksVisible = yield select(completeTasksVisibilitySelector);
    const status = completeTasksVisible ? 'ALL' : 'INCOMPLETE';

    if (order) {
      localStorageHelper.setItem(getSortStorageKey('patient', status), {
        key,
        order,
      });
    } else if (order === null) {
      localStorageHelper.removeItem(getSortStorageKey('patient', status));
    }

    yield put({
      type: ActionTypes.SORT_PATIENT_TASKS,
      payload: {
        key: order ? key : null,
        order,
      },
    });
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch (error) {
    log(error);
  }
}

function* createPatientAttachment({
  patientIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
}) {
  try {
    const attachment = yield call(
      PatientAttachmentApi.createPatientAttachment,
      patientIdentifier,
      folderIdentifier,
      fileData,
      additionalConfig,
    );
    setCurrentlyUploadedAttachment(null);
    onAttachmentFileInputChange(restAttachments);
    yield put({ type: ActionTypes.ADD_PATIENT_ATTACHMENT_SUCCESS, attachment });
  } catch (error) {
    setCurrentlyUploadedAttachment(null);
    onAttachmentFileInputChange(restAttachments);

    yield put({
      type: ActionTypes.ADD_PATIENT_ATTACHMENT_FAILURE,
      patientIdentifier,
      folderIdentifier,
    });

    yield error.response && error.response.status === 413
      ? put(
          AlertActions.showGlobalErrorAlert(
            'File exceeded the allowed size of 100 MB',
          ),
        )
      : put(AlertActions.showGlobalErrorAlert());
  }
}

function* deletePatientAttachment({ patientIdentifier, identifier }) {
  try {
    yield call(PatientAttachmentApi.deletePatientAttachment, identifier);
    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put({
        type: ActionTypes.DELETE_PATIENT_ATTACHMENT_SUCCESS,
        patientIdentifier,
        identifier,
      }),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.DELETE_PATIENT_ATTACHMENT_FAILURE,
        patientIdentifier,
        identifier,
      }),
      put(PatientDetailsActions.getCurrentPatient()),
      put(AlertActions.showGlobalErrorAlert()),
    ]);
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
    yield put(PatientDetailsActions.getCurrentPatient());
  }
}

function* doUpdatePatientDetails({ payload: { patientIdentifier, details } }) {
  try {
    onPatientDetailsEdited();
    const updatedPatientDetails = yield call(
      PatientApi.updatePatient,
      patientIdentifier,
      details,
    );
    yield put({
      type: ActionTypes.UPDATE_PATIENT_DETAILS_SUCCESS,
      payload: { details: { ...updatedPatientDetails } },
    });
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(PatientDetailsActions.getCurrentPatient());
  }
}

function* doArchivePatient({ payload: { patientIdentifier, history } }) {
  try {
    yield call(PatientApi.archivePatient, patientIdentifier);
    yield put(closeModal());
    yield put(showGlobalAlert(AlertMessages.ARCHIVED));
    history.push(PATIENTS_LIST_ALL);
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(closeModal());
  }
}

function* doDeletePatientArchive({ payload: { patientIdentifier, history } }) {
  try {
    yield call(PatientApi.deletePatientArchive, patientIdentifier);
    yield put(closeModal());
    yield put(showGlobalAlert(AlertMessages.ARCHIVED));
    history.push(PATIENTS_LIST_ALL);
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(closeModal());
  }
}

function* doUnarchivePatient({ payload: { patientIdentifier, history } }) {
  try {
    yield call(PatientApi.unarchivePatient, patientIdentifier);
    yield put(closeModal());
    yield put(showGlobalAlert(AlertMessages.UNARCHIVED));
    history.push(PATIENTS_LIST_ALL);
  } catch {
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
    yield put(PatientDetailsActions.getCurrentPatient());
  }
}

function* doRemovePatientNote({ patientNoteIdentifier }) {
  try {
    yield put(PatientDetailsActions.deletePatientNote(patientNoteIdentifier));
    yield call(PatientApi.deletePatientNote, patientNoteIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
    yield put(PatientDetailsActions.getCurrentPatient());
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
    yield put(PatientDetailsActions.getCurrentPatient());
  }
}

function* doTogglePatientCompleteTasksVisible() {
  try {
    yield put(PatientDetailsActions.getCurrentPatientTasks());
  } catch {
    yield put(AlertActions.showGlobalErrorAlert());
  }
}

function* mergePatient({ fromPatient, toPatient, onSuccess }) {
  try {
    yield call(
      PatientApi.mergePatient,
      fromPatient.patientIdentifier,
      toPatient.patientIdentifier,
    );
    yield all([
      put({
        type: ActionTypes.MERGE_PATIENT_SUCCESS,
        fromPatient,
        toPatient,
      }),
      put(showGlobalAlert(AlertMessages.MERGED)),
    ]);
    // eslint-disable-next-line no-unused-expressions
    onSuccess?.();
  } catch {
    yield all([
      put(AlertActions.showGlobalErrorAlert()),
      put({ type: ActionTypes.MERGE_PATIENT_FAILURE }),
    ]);
  }
}

export function* createPatientAttachmentFolder({
  patientIdentifier,
  name,
  folderIdentifier,
}) {
  try {
    const folder = yield call(
      PatientAttachmentApi.createAttachmentFolder,
      patientIdentifier,
      name,
      folderIdentifier,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.CREATED)),
      put({
        type: ActionTypes.ADD_PATIENT_ATTACHMENT_FOLDER_SUCCESS,
        folder,
      }),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({
        type: ActionTypes.ADD_PATIENT_ATTACHMENT_FOLDER_FAILURE,
        patientIdentifier,
        name,
      }),
    ]);
  }
}

export function* createPatientAttachmentReference({
  patientIdentifier,
  name,
  url,
  mimeType,
  referenceType,
  folderIdentifier,
}) {
  try {
    const attachment = yield call(
      PatientAttachmentApi.createAttachmentReference,
      patientIdentifier,
      name,
      url,
      mimeType,
      referenceType,
      folderIdentifier,
    );
    yield all([
      put(showGlobalAlert(AlertMessages.CREATED)),
      put({
        type: ActionTypes.ADD_PATIENT_ATTACHMENT_REFERENCE_SUCCESS,
        attachment,
      }),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({
        type: ActionTypes.ADD_PATIENT_ATTACHMENT_REFERENCE_FAILURE,
        patientIdentifier,
        name,
      }),
    ]);
  }
}

function* updatePatientAttachment({ attachment, dataToUpdate }) {
  try {
    const updatedAttachment = yield call(
      PatientAttachmentApi.updatePatientAttachment,
      {
        ...attachment,
        ...dataToUpdate,
      },
    );
    yield all([
      put({
        type: ActionTypes.UPDATE_PATIENT_ATTACHMENT_SUCCESS,
        attachment: updatedAttachment,
      }),
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.UPDATE_PATIENT_ATTACHMENT_SUCCESS,
        attachment,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* updatePatientTaskAttachment({
  attachmentIdentifier,
  updatedFileName,
}) {
  try {
    const updatedTaskAttachment = yield call(
      TaskApi.updateTaskAttachment,
      attachmentIdentifier,
      updatedFileName,
    );
    yield all([
      put({
        type: ActionTypes.UPDATE_PATIENT_TASK_ATTACHMENT_SUCCESS,
        attachment: updatedTaskAttachment,
      }),
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([put(showGlobalErrorAlert())]);
  }
}

function* deletePatientTaskAttachment({ identifier }) {
  try {
    yield call(TaskApi.removeTaskAttachment, identifier);
    yield all([
      put({
        type: ActionTypes.DELETE_PATIENT_TASK_ATTACHMENT_SUCCESS,
        identifier: identifier,
      }),
      put(showGlobalAlert(AlertMessages.DELETED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([put(showGlobalErrorAlert())]);
  }
}

function* movePatientAttachment({ attachment, destinationFolderIdentifier }) {
  try {
    const updatedAttachment = yield call(
      PatientAttachmentApi.updatePatientAttachment,
      {
        ...attachment,
        parentAttachmentIdentifier: destinationFolderIdentifier,
      },
    );
    yield all([
      put({
        type: ActionTypes.MOVE_PATIENT_ATTACHMENT_SUCCESS,
        attachment: updatedAttachment,
        destinationFolderIdentifier,
      }),
      put(showGlobalAlert(AlertMessages.MOVED)),
      put(closeModal()),
    ]);
  } catch {
    yield all([
      put({
        type: ActionTypes.MOVE_PATIENT_ATTACHMENT_SUCCESS,
        attachment,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

export default function* watchPatientDetails() {
  yield takeLatest(
    ActionTypes.INITIALIZE_PATIENT_STATE,
    initializePatientState,
  );
  yield takeLatest(
    ActionTypes.INITIALIZE_PATIENT_ATTACHMENTS_FOLDER,
    initializePatientAttachmentFolder,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_PATIENT, getCurrentPatient);
  yield takeLatest(
    ActionTypes.GET_CURRENT_PATIENT_LABELS,
    getCurrentPatientLabels,
  );
  yield takeLatest(
    ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS,
    getCurrentPatientAttachments,
  );
  yield takeLatest(
    ActionTypes.GET_CURRENT_PATIENT_TASKS,
    getCurrentPatientTasks,
  );
  yield takeLatest(ActionTypes.GET_PATIENT_TASKS_STATS, getPatientTasksStats);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_STATUS, doToggleTaskCompleteStatus);
  yield takeLatest(
    DO_UPDATE_PATIENT_WORKFLOW_STATUS,
    doUpdatePatientTaskWorkflowStatus,
  );
  yield takeLatest(DO_UPDATE_PATIENT_TASK, doUpdatePatientTaskInList);
  yield takeLatest(
    ActionTypes.GET_PATIENT_FILTER_OPTIONS,
    getPatientFilterOptions,
  );
  yield takeLatest(
    ActionTypes.CHANGE_PATIENT_TASKS_FILTERS,
    changePatientTasksFilters,
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
  yield takeLatest(
    ActionTypes.TOGGLE_PATIENT_COMPLETE_TASKS_VISIBLE,
    doTogglePatientCompleteTasksVisible,
  );
  yield takeEvery(DO_UPDATE_PATIENT_NOTE, doUpdatePatientNote);
  yield takeLeading(ActionTypes.UPDATE_PATIENT_DETAILS, doUpdatePatientDetails);
  yield takeEvery(DO_UNARCHIVE_PATIENT, doUnarchivePatient);
  yield takeEvery(DO_ARCHIVE_PATIENT, doArchivePatient);
  yield takeEvery(DO_DELETE_PATIENT_ARCHIVE, doDeletePatientArchive);
  yield takeEvery(DO_ADD_PATIENT_NOTE, doAddPatientNote);
  yield takeEvery(DO_REMOVE_PATIENT_NOTE, doRemovePatientNote);
  yield takeEvery(DO_CHANGE_PATIENT_NOTE_PIN, doChangePatientNotePin);
  yield takeEvery(ActionTypes.MERGE_PATIENT, mergePatient);
  yield takeEvery(
    ActionTypes.DELETE_PATIENT_ATTACHMENT,
    deletePatientAttachment,
  );
  yield takeEvery(
    ActionTypes.ADD_PATIENT_ATTACHMENT_FOLDER,
    createPatientAttachmentFolder,
  );
  yield takeEvery(
    ActionTypes.UPDATE_PATIENT_ATTACHMENT,
    updatePatientAttachment,
  );
  yield takeEvery(
    ActionTypes.UPDATE_PATIENT_TASK_ATTACHMENT,
    updatePatientTaskAttachment,
  );
  yield takeEvery(
    ActionTypes.DELETE_PATIENT_TASK_ATTACHMENT,
    deletePatientTaskAttachment,
  );
  yield takeEvery(ActionTypes.MOVE_PATIENT_ATTACHMENT, movePatientAttachment);
  yield takeEvery(ActionTypes.ADD_PATIENT_ATTACHMENT, createPatientAttachment);
  yield takeEvery(
    ActionTypes.ADD_PATIENT_ATTACHMENT_REFERENCE,
    createPatientAttachmentReference,
  );
}
