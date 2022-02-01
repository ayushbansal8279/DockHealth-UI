import * as ActionTypes from 'actions/action-types';

export function openDrawer(
  identifier,
  workflow = null,
  autoFocusFieldName = null,
) {
  return {
    type: ActionTypes.OPEN_WORKFLOW_DRAWER,
    identifier,
    workflow,
    autoFocusFieldName,
  };
}

export function closeDrawer() {
  return {
    type: ActionTypes.CLOSE_WORKFLOW_DRAWER,
  };
}

export function getDrawerWorkflowDetails() {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_DETAILS,
  };
}

export function getDrawerWorkflowDetailsSuccess(workflow) {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_DETAILS_SUCCESS,
    workflow,
  };
}

export function getDrawerWorkflowDetailsFailure() {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_DETAILS_FAILURE,
  };
}

export function updateDrawerWorkflowPatient(patient) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_DRAWER_PATIENT,
    patient,
  };
}

export function getHistory() {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_HISTORY,
  };
}

export function getHistorySuccess(history) {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_HISTORY_SUCCESS,
    history,
  };
}

export function getHistoryFailure() {
  return {
    type: ActionTypes.GET_WORKFLOW_DRAWER_HISTORY_FAILURE,
  };
}
