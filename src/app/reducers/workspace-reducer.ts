import * as ActionTypes from 'actions/action-types';
import { Workspace } from '../types/workspace';

const initialState: Workspace = {
  workspaceIdentifier: '',
  workspaceName: '',
  workspaceInitials: '',
  workspaceProfileColor: '',
  active: false,
  createdDateTime: '',
};

const WorkspaceReducer = (
  state = initialState,
  action: { type: string; workspace: Workspace },
) => {
  switch (action.type) {
    case ActionTypes.GET_SELECTED_WORKSPACE_SUCCESS: {
      const { workspace } = action;
      return workspace;
    }

    case ActionTypes.CLEAR_SELECTED_WORKSPACE: {
      return initialState;
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default WorkspaceReducer;
