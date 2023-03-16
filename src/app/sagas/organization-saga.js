import * as ActionTypes from 'actions/action-types';
import {
  all,
  call,
  put,
  select,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import * as OrganizationApi from 'api/organization-api';
import * as OrganizationActions from 'actions/organization-actions';
import { showGlobalErrorAlert, showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { updateWorkflowStatusForTasks } from 'actions/task-actions';
import { organizationStatusesSelector } from 'selectors/organization-selectors';
import pluck from 'ramda/src/pluck';
import move from 'ramda/src/move';
import * as CustomFieldsApi from 'api/custom-fields-api';

const GET_ORGANIZATION_STATUSES = '@@saga/GET_ORGANIZATION_STATUSES';
const DELETE_ORGANIZATION_STATUS = '@@saga/DELETE_ORGANIZATION_STATUS';
const CREATE_ORGANIZATION_STATUS = '@@saga/CREATE_ORGANIZATION_STATUS';
const UPDATE_ORGANIZATION_STATUS = '@@saga/UPDATE_ORGANIZATION_STATUS';
const REORDER_ORGANIZATION_STATUSES = '@@saga/REORDER_ORGANIZATION_STATUSES';

export function getOrganizationStatuses() {
  return {
    type: GET_ORGANIZATION_STATUSES,
  };
}

export function deleteOrganizationStatus(identifier) {
  return {
    type: DELETE_ORGANIZATION_STATUS,
    identifier,
  };
}

export function createOrganizationStatus(status) {
  return {
    type: CREATE_ORGANIZATION_STATUS,
    status,
  };
}

export function updateOrganizationStatus(identifier, dataToUpdate) {
  return {
    type: UPDATE_ORGANIZATION_STATUS,
    identifier,
    dataToUpdate,
  };
}

export function reorderOrganizationStatuses(sourceId, destinationId) {
  return {
    type: REORDER_ORGANIZATION_STATUSES,
    sourceId,
    destinationId,
  };
}

function* doGetOrganizationStatuses() {
  try {
    yield put(OrganizationActions.setFetchingOrganizationStatuses());
    const statuses = yield call(OrganizationApi.getOrganizationStatuses);
    yield put(OrganizationActions.setOrganizationStatuses(statuses));
  } catch {
    yield put(OrganizationActions.setOrganizationStatusesError());
    yield put(showGlobalErrorAlert());
  }
}

function* doDeleteOrganizationStatus({ identifier }) {
  try {
    yield call(OrganizationApi.deleteOrganizationStatus, identifier);
    yield put({ type: ActionTypes.DELETE_ORGANIZATION_STATUS, identifier });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* doCreateOrganizationStatus({ status }) {
  try {
    const createdStatus = yield call(
      OrganizationApi.createOrganizationStatus,
      status,
    );
    yield put({
      type: ActionTypes.ADD_ORGANIZATION_STATUS,
      status: createdStatus,
    });
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* doUpdateOrganizationStatus({ identifier, dataToUpdate }) {
  try {
    const updatedStatus = yield call(
      OrganizationApi.updateOrganizationStatus,
      identifier,
      dataToUpdate,
    );
    yield put(
      OrganizationActions.updateOrganizationStatus(identifier, updatedStatus),
    );
    yield put(updateWorkflowStatusForTasks(identifier, dataToUpdate));
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* doReorderOrganizationStatuses({ sourceId, destinationId }) {
  const statuses = yield select(organizationStatusesSelector);
  if (!statuses || statuses.length === 0) return;

  try {
    const statusIds = pluck('identifier', statuses);
    const sourceIndex = statusIds.indexOf(sourceId);
    const destinationIndex = statusIds.indexOf(destinationId);

    if (sourceIndex === -1 || destinationIndex === -1) return;

    const reorderedStatuses = move(sourceIndex, destinationIndex, statuses);
    yield all([
      put(OrganizationActions.setOrganizationStatuses(reorderedStatuses)),
      call(
        OrganizationApi.reorderOrganizationStatuses,
        pluck('identifier', reorderedStatuses),
      ),
    ]);
  } catch {
    yield put(OrganizationActions.setOrganizationStatuses(statuses));
    yield put(showGlobalErrorAlert());
  }
}

function* changeUserOrganizationRole({ userIdentifier, role }) {
  try {
    yield call(
      OrganizationApi.changeUserOrganizationRole,
      userIdentifier,
      role,
    );
    yield put(showGlobalAlert(`User's role changed successfully`));
    yield put({ type: ActionTypes.CHANGE_USER_ORGANIZATION_ROLE_SUCCESS });
  } catch {
    yield put({ type: ActionTypes.CHANGE_USER_ORGANIZATION_ROLE_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* getOrganizationCustomFields() {
  try {
    const organizationCustomFields = yield call(
      CustomFieldsApi.getAllTaskListCustomFields,
    );
    yield put({
      type: ActionTypes.GET_ORGANIZATION_CUSTOM_FIELDS_SUCCESS,
      organizationCustomFields,
    });
  } catch {
    yield put({ type: ActionTypes.GET_ORGANIZATION_CUSTOM_FIELDS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* changeUserOrganizationRoleSuccess() {
  yield put(OrganizationActions.getOrganizationUsers());
}

function* updateSubscriptionPlan({ newPlan }) {
  try {
    yield call(OrganizationApi.updateSubscriptionPlan, newPlan);
    yield put({ type: ActionTypes.UPDATE_SUBSCRIPTION_PLAN_SUCCESS, newPlan });
  } catch {
    yield put({ type: ActionTypes.UPDATE_SUBSCRIPTION_PLAN_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchOrganization() {
  yield takeLatest(GET_ORGANIZATION_STATUSES, doGetOrganizationStatuses);
  yield takeLatest(DELETE_ORGANIZATION_STATUS, doDeleteOrganizationStatus);
  yield takeLatest(CREATE_ORGANIZATION_STATUS, doCreateOrganizationStatus);
  yield takeLatest(UPDATE_ORGANIZATION_STATUS, doUpdateOrganizationStatus);
  yield takeLatest(
    REORDER_ORGANIZATION_STATUSES,
    doReorderOrganizationStatuses,
  );
  yield takeEvery(
    ActionTypes.CHANGE_USER_ORGANIZATION_ROLE,
    changeUserOrganizationRole,
  );
  yield takeEvery(
    ActionTypes.CHANGE_USER_ORGANIZATION_ROLE_SUCCESS,
    changeUserOrganizationRoleSuccess,
  );
  yield takeEvery(
    ActionTypes.GET_ORGANIZATION_CUSTOM_FIELDS,
    getOrganizationCustomFields,
  );
  yield takeLatest(
    ActionTypes.UPDATE_SUBSCRIPTION_PLAN,
    updateSubscriptionPlan,
  );
}
