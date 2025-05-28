import * as ActionTypes from 'actions/action-types';
import { createWorkspacePayload } from '../types/workspace';

export function getCurrentWorkspace(workspaceIdentifier: string) {
  return {
    type: ActionTypes.GET_SELECTED_WORKSPACE,
    workspaceIdentifier,
  };
}

export function updateSelectedWorkspace(workspace: createWorkspacePayload) {
  return {
    type: ActionTypes.UPDATE_SELECTED_WORKSPACE,
    workspace,
  };
}

export function clearWorkspaceState() {
  return {
    type: ActionTypes.CLEAR_SELECTED_WORKSPACE,
  };
}
