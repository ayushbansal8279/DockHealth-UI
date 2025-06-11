import * as ActionTypes from 'actions/action-types';
import { Workspace, WorkspaceUser } from '../types/workspace';

const initialState: Workspace = {
  workspaceIdentifier: '',
  workspaceName: '',
  workspaceInitials: '',
  workspaceProfileColor: '',
  active: false,
  createdDateTime: '',
  workspaceUsers: [],
};

interface GetSelectedWorkspaceSuccessAction {
  type: typeof ActionTypes.GET_SELECTED_WORKSPACE_SUCCESS;
  workspace: Workspace;
}

interface ClearSelectedWorkspaceAction {
  type: typeof ActionTypes.CLEAR_SELECTED_WORKSPACE;
}

interface GetWorkspaceUsersAction {
  type: typeof ActionTypes.GET_WORKSPACE_USERS;
}

interface GetWorkspaceUsersSuccessAction {
  type: typeof ActionTypes.GET_WORKSPACE_USERS_SUCCESS;
  payload: WorkspaceUser[];
}

interface GetWorkspaceUsersFailureAction {
  type: typeof ActionTypes.GET_WORKSPACE_USERS_FAILURE;
}

interface ChangeWorkspaceUserRoleSuccessAction {
  type: typeof ActionTypes.CHANGE_WORKSPACE_USER_ROLE_SUCCESS;
  payload: {
    userIdentifier: string;
    role: string;
  };
}
interface RemoveUserFromWorkspaceSuccessAction {
  type: typeof ActionTypes.REMOVE_USER_FROM_WORKSPACE_SUCCESS;
  payload: {
    userIdentifier: string;
  };
}

type WorkspaceActions =
  | GetSelectedWorkspaceSuccessAction
  | ClearSelectedWorkspaceAction
  | GetWorkspaceUsersAction
  | GetWorkspaceUsersSuccessAction
  | GetWorkspaceUsersFailureAction
  | ChangeWorkspaceUserRoleSuccessAction
  | RemoveUserFromWorkspaceSuccessAction;

const WorkspaceReducer = (
  state = initialState,
  // action: { type: string; workspace: Workspace },
  action: WorkspaceActions,
) => {
  switch (action.type) {
    case ActionTypes.GET_SELECTED_WORKSPACE_SUCCESS: {
      const { workspace } = action;
      return workspace;
    }

    case ActionTypes.CLEAR_SELECTED_WORKSPACE: {
      return initialState;
    }

    case ActionTypes.GET_WORKSPACE_USERS: {
      return {
        ...state,
        isFetchingWorkspaceUsers: true,
        workspaceUsersError: null,
      };
    }

    case ActionTypes.GET_WORKSPACE_USERS_SUCCESS: {
      return {
        ...state,
        isFetchingWorkspaceUsers: false,
        workspaceUsers: action.payload,
      };
    }

    case ActionTypes.GET_WORKSPACE_USERS_FAILURE: {
      return {
        ...state,
        isFetchingWorkspaceUsers: false,
      };
    }

    case ActionTypes.CHANGE_WORKSPACE_USER_ROLE_SUCCESS: {
      const { userIdentifier, role } = action.payload;
      return {
        ...state,
        workspaceUsers: state.workspaceUsers?.map((user) =>
          user.userIdentifier === userIdentifier
            ? { ...user, workspaceUserRole: role }
            : user
        ),
      };
    }
 
    case ActionTypes.REMOVE_USER_FROM_WORKSPACE_SUCCESS: {
      const { userIdentifier } = action.payload;
      return {
        ...state,
        workspaceUsers: state.workspaceUsers?.map((user) =>
          user.userIdentifier === userIdentifier
            ? { ...user, userStatus: 'INACTIVE' }
            : user
        ),
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default WorkspaceReducer;
