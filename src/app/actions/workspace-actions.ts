import * as ActionTypes from 'actions/action-types';
import AlertMessages from '../alert/AlertMessages';

export function initializeWorkspaceState(workspaceIdentifier: string) {
  return {
    type: ActionTypes.GET_SELECTED_WORKSPACE,
    workspaceIdentifier,
  };
}

export function clearWorkspaceState() {
  return {
    type: ActionTypes.CLEAR_SELECTED_WORKSPACE,
  };
}
