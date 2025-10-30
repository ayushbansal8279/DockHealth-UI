import * as ActionTypes from 'actions/action-types';

export function getAllUserWorkspaces() {
  return {
    type: ActionTypes.GET_ALL_USER_WORKSPACES
  };
}

export function updateWorkspaceAction(payload) {
  return {
    type: ActionTypes.UPDATE_WORKSPACE,
    payload,
  };
}

export function deleteWorkspaceAction(workspaceIdentifier: string) {
  return {
    type: ActionTypes.DELETE_WORKSPACE,
    workspaceIdentifier,
  };
}

export function reorderWorkspaceTaskLists(activeLists, workspaceIdentifier) {
  return {  
    type: ActionTypes.REORDER_WORKSPACE_TASKLISTS,
    payload: { activeLists , workspaceIdentifier},
  }
}