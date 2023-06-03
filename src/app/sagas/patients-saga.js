import {
  all,
  put,
  call,
  takeLatest,
  takeEvery,
  select,
  debounce,
} from 'redux-saga/effects';
import * as PatientsApi from 'api/patients-api';
import { addLabel, removeLabelForPatient } from 'api/patient-label-api';
import * as PatientsActions from 'actions/patients-actions';
import {
  currentPatientsListIdentifierSelector,
  patientsListSearchTermSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import * as ActionTypes from 'actions/action-types';
import {
  PatientsListType,
  DefaultPatientsListType,
} from 'helpers/patient-list-helpers';
import AlertMessages from 'alert/AlertMessages';

function* getPatientsLists() {
  try {
    const lists = yield call(PatientsApi.getPatientsLists);

    const defaultPatientsLists = lists.filter(
      ({ listType }) => listType === PatientsListType.DEFAULT,
    );
    const customPatientsLists = lists.filter(
      ({ listType }) => listType === PatientsListType.CUSTOM,
    );

    yield put({
      type: ActionTypes.GET_PATIENTS_LISTS_SUCCESS,
      defaultPatientsLists,
      customPatientsLists,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_PATIENTS_LISTS_FAILURE,
    });
  }
}

function* deletePatientsList({ identifier }) {
  try {
    yield call(PatientsApi.deletePatientsList, identifier);
    yield put({
      type: ActionTypes.DELETE_PATIENTS_LIST_SUCCESS,
      identifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.DELETE_PATIENTS_LIST_FAILURE,
    });
  }
}

function* updatePatientsList({ identifier, dataToUpdate }) {
  try {
    const updatedData = yield call(
      PatientsApi.updatePatientsList,
      identifier,
      dataToUpdate,
    );
    yield put({
      type: ActionTypes.UPDATE_PATIENTS_LIST_SUCCESS,
      identifier,
      dataToUpdate: updatedData,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_PATIENTS_LIST_FAILURE,
      identifier,
    });
  }
}

function* updatePatientsListPreferences({ payload }) {
  try {
    const { setup, patientListIdentifier } = payload;
    yield call(
      PatientsApi.updatePatientListPreferences,
      setup,
      patientListIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_PATIENTS_LIST_PREFERENCES_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_PATIENTS_LIST_PREFERENCES_FAILURE });
  }
}

function* initializePatientsListState({ patientsListIdentifier }) {
  if (
    !(
      patientsListIdentifier === DefaultPatientsListType.ALL_PATIENTS ||
      patientsListIdentifier === DefaultPatientsListType.ACTIVE_PATIENTS ||
      patientsListIdentifier === DefaultPatientsListType.ARCHIVED_PATIENTS
    )
  ) {
    yield all([
      put(PatientsActions.getCurrentPatientsListDetails()),
      put(PatientsActions.getCurrentPatients()),
    ]);
  } else {
    yield all([put(PatientsActions.getCurrentPatientsListDetails())]);
  }
}

function* getCurrentPatientsListFilterOptions() {
  try {
    const currentPatientsListIdentifier = yield select(
      currentPatientsListIdentifierSelector,
    );
    const selectedFilters = yield select(patientsSelectedFiltersSelector);

    if (selectedFilters) {
      const filterValues = Object.values(selectedFilters);

      if (filterValues.length > 0) {
        const firstFilter = filterValues[0];
        if (
          (firstFilter.dateStart && !firstFilter.dateEnd) ||
          (firstFilter.dateEnd && !firstFilter.dateStart)
        ) {
          return;
        }
      }
    }

    if (!selectedFilters) {
      const options = yield call(
        PatientsApi.getPatientsListFilterOptions,
        currentPatientsListIdentifier,
        selectedFilters,
      );

      yield put({
        type: ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_SUCCESS,
        options,
      });
    }
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS_FAILURE,
    });
  }
}

function* getCurrentPatientsListDetails() {
  try {
    const currentPatientsListIdentifier = yield select(
      currentPatientsListIdentifierSelector,
    );
    const listDetails = yield call(
      PatientsApi.getPatientsListDetails,
      currentPatientsListIdentifier,
    );

    yield put({
      type: ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_SUCCESS,
      listDetails,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS_FAILURE,
    });
  }
}

function* getCurrentPatients() {
  try {
    const currentPatientsListIdentifier = yield select(
      currentPatientsListIdentifierSelector,
    );
    const searchTerm = yield select(patientsListSearchTermSelector);
    const selectedFilters = yield select(patientsSelectedFiltersSelector);

    let patients;

    if (selectedFilters) {
      const filterValues = Object.values(selectedFilters);

      if (filterValues.length > 0) {
        const firstFilter = filterValues[0];
        if (
          (firstFilter.dateStart && !firstFilter.dateEnd) ||
          (firstFilter.dateEnd && !firstFilter.dateStart)
        ) {
          return;
        }
      }

      patients = yield call(
        PatientsApi.getPatientsByFilterCriteria,
        currentPatientsListIdentifier,
        selectedFilters,
      );
    } else if (searchTerm) {
      patients = yield call(
        PatientsApi.getPatientsByCriteria,
        searchTerm,
        currentPatientsListIdentifier,
      );
    } else {
      patients = yield call(
        PatientsApi.getPatientsByListId,
        currentPatientsListIdentifier,
      );
    }

    yield put({
      type: ActionTypes.GET_CURRENT_PATIENTS_SUCCESS,
      patients,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_CURRENT_PATIENTS_FAILURE,
    });
  }
}

function* searchPatients() {
  yield put(PatientsActions.getCurrentPatients());
}

function* filtersChange() {
  yield put(PatientsActions.getCurrentPatients());
  yield put(PatientsActions.getCurrentPatientsListFilterOptions());
}

function* clearPatients() {
  const patients = [];
  yield put({
    type: ActionTypes.GET_CURRENT_PATIENTS_SUCCESS,
    patients,
  });
}

function* clearFilters() {
  const patients = [];
  yield put({
    type: ActionTypes.GET_CURRENT_PATIENTS_SUCCESS,
    patients,
  });
  yield put(PatientsActions.getCurrentPatientsListFilterOptions());
}

function* addBulkTask({ payload }) {
  try {
    yield call(PatientsApi.patientBulkCreateTask, payload);
    yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* addBulkLabel({ payload }) {
  try {
    yield call(PatientsApi.patientBulkAddLabel, payload);
    yield put(showGlobalAlert(AlertMessages.LABEL_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* addPatientLabel({ payload }) {
  try {
    const label = yield call(addLabel, payload);
    yield put({
      type: ActionTypes.PATIENT_ADD_LABEL_SUCCESS,
      label,
    });
    yield put(showGlobalAlert(AlertMessages.LABEL_CREATED));
  } catch {
    yield put({
      type: ActionTypes.PATIENT_ADD_LABEL_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* deleteBulkLabel({ payload }) {
  try {
    yield call(PatientsApi.patientBulkDeleteLabel, payload);
    yield put(showGlobalAlert(AlertMessages.LABEL_DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deletePatientLabel({ payload }) {
  try {
    yield call(removeLabelForPatient, payload);
    yield put({
      type: ActionTypes.PATIENT_DELETE_LABEL_SUCCESS,
      deletedLabelIdentifier: payload.labelIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.LABEL_DELETED));
  } catch {
    yield put({
      type: ActionTypes.PATIENT_DELETE_LABEL_FAILURE,
    });
    yield put(showGlobalErrorAlert());
  }
}

function* addBulkWorkflow({ payload }) {
  try {
    yield call(PatientsApi.patientBulkCreateWorkflow, payload);
    yield put(showGlobalAlert(AlertMessages.WORKFLOW_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteBulkPatient({ payload }) {
  const { assignedPatients } = payload;
  try {
    yield call(PatientsApi.patientBulkDeletePatient, assignedPatients);
    yield all([
      put({
        type: ActionTypes.PATIENT_BULK_DELETE_PATIENTS_SUCCESS,
        patientIdentifiers: assignedPatients,
      }),
      put(showGlobalAlert(AlertMessages.DELETED)),
    ]);
  } catch {
    yield all([
      put({ type: ActionTypes.PATIENT_BULK_DELETE_PATIENTS_FAILURE }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

export default function* watchPatients() {
  yield takeLatest(ActionTypes.GET_PATIENTS_LISTS, getPatientsLists);
  yield takeEvery(ActionTypes.DELETE_PATIENTS_LIST, deletePatientsList);
  yield takeEvery(ActionTypes.UPDATE_PATIENTS_LIST, updatePatientsList);
  yield takeLatest(
    ActionTypes.INITIALIZE_PATIENTS_LIST_STATE,
    initializePatientsListState,
  );
  yield takeLatest(
    ActionTypes.GET_CURRENT_PATIENTS_LIST_DETAILS,
    getCurrentPatientsListDetails,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_PATIENTS, getCurrentPatients);
  yield takeLatest(ActionTypes.CLEAR_PATIENTS, clearPatients);
  yield takeLatest(
    ActionTypes.GET_CURRENT_PATIENTS_LIST_FILTER_OPTIONS,
    getCurrentPatientsListFilterOptions,
  );
  yield debounce(300, ActionTypes.SEARCH_PATIENTS, searchPatients);
  yield takeLatest([ActionTypes.SET_PATIENTS_SELECTED_FILTERS], filtersChange);
  yield takeLatest([ActionTypes.CLEAR_PATIENTS_FILTERS], clearFilters);
  yield takeEvery(ActionTypes.PATIENT_BULK_CREATE_TASK, addBulkTask);
  yield takeEvery(ActionTypes.PATIENT_BULK_ADD_LABEL, addBulkLabel);
  yield takeEvery(ActionTypes.PATIENT_BULK_DELETE_LABEL, deleteBulkLabel);
  yield takeEvery(ActionTypes.PATIENT_ADD_LABEL, addPatientLabel);
  yield takeEvery(ActionTypes.PATIENT_DELETE_LABEL, deletePatientLabel);
  yield takeEvery(ActionTypes.PATIENT_BULK_CREATE_WORKFLOW, addBulkWorkflow);
  yield takeEvery(ActionTypes.PATIENT_BULK_DELETE_PATIENTS, deleteBulkPatient);
  yield takeEvery(
    ActionTypes.UPDATE_PATIENTS_LIST_PREFERENCES,
    updatePatientsListPreferences,
  );
}
