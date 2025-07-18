import * as ActionTypes from 'actions/action-types';
import { TaskList, Workspace, WorkspaceUser } from '../types/workspace';

const initialState: Workspace = {
  workspaceIdentifier: '',
  workspaceName: '',
  workspaceInitials: '',
  workspaceProfileColor: '',
  active: false,
  createdDateTime: '',
  workspaceUsers: [],
  workspaceTaskLists: null,
  isFetchingWorkspaceTaskLists: false,
  isSavingWorkspaceTaskList: false,
  archivedWorkspaceTaskLists: null,
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

export interface GetWorkspaceTaskListsRequestAction {
  type: typeof ActionTypes.GET_WORKSPACE_TASKLISTS_REQUEST;
}

export interface GetWorkspaceTaskListsSuccessAction {
  type: typeof ActionTypes.GET_WORKSPACE_TASKLISTS_SUCCESS;
  payload: {
    taskLists: TaskList[];
  };
}

export interface GetWorkspaceTaskListsFailureAction {
  type: typeof ActionTypes.GET_WORKSPACE_TASKLISTS_FAILURE;
}

export interface GetArchivedWorkspaceTaskListsSuccessAction {
  type: typeof ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS_SUCCESS;
  payload: {
    taskLists: TaskList[];
  };
}

export interface SaveWorkspaceTaskListRequestAction {
  type: typeof ActionTypes.SAVE_WORKSPACE_TASKLIST_REQUEST;
}

export interface AddWorkspaceTaskListSuccessAction {
  type: typeof ActionTypes.ADD_WORKSPACE_TASKLIST_SUCCESS;
  payload: TaskList;
}

export interface UpdateWorkspaceTaskListSuccessAction {
  type: typeof ActionTypes.UPDATE_WORKSPACE_TASKLIST_SUCCESS;
  payload: TaskList;
}

export interface SaveWorkspaceTaskListFailureAction {
  type: typeof ActionTypes.SAVE_WORKSPACE_TASKLIST_FAILURE;
}

export interface DeleteWorkspaceTaskListSuccessAction {
  type: typeof ActionTypes.DELETE_WORKSPACE_TASKLIST_SUCCESS;
  taskListIdentifier: string;
}

export interface LeaveWorkspaceTaskListSuccessAction {
  type: typeof ActionTypes.LEAVE_WORKSPACE_TASKLIST_SUCCESS;
  taskListIdentifier: string;
}

export interface ArchiveWorkspaceTaskListSuccessAction {
  type: typeof ActionTypes.ARCHIVE_WORKSPACE_TASKLIST_SUCCESS;
  payload: {
    taskListIdentifier: string;
  };
}

type WorkspaceActions =
  | GetSelectedWorkspaceSuccessAction
  | ClearSelectedWorkspaceAction
  | GetWorkspaceUsersAction
  | GetWorkspaceUsersSuccessAction
  | GetWorkspaceUsersFailureAction
  | ChangeWorkspaceUserRoleSuccessAction
  | RemoveUserFromWorkspaceSuccessAction
  | GetWorkspaceTaskListsRequestAction
  | GetWorkspaceTaskListsSuccessAction
  | GetWorkspaceTaskListsFailureAction
  | GetArchivedWorkspaceTaskListsSuccessAction
  | SaveWorkspaceTaskListRequestAction
  | AddWorkspaceTaskListSuccessAction
  | UpdateWorkspaceTaskListSuccessAction
  | SaveWorkspaceTaskListFailureAction
  | DeleteWorkspaceTaskListSuccessAction
  | LeaveWorkspaceTaskListSuccessAction
  | ArchiveWorkspaceTaskListSuccessAction;

const WorkspaceReducer = (
  state = initialState,
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

    // Worksapce List

    case ActionTypes.GET_WORKSPACE_TASKLISTS_REQUEST:
      return {
        ...state,
        isFetchingWorkspaceTaskLists: true,
      };

    case ActionTypes.GET_WORKSPACE_TASKLISTS_SUCCESS:
      return {
        ...state,
        isFetchingWorkspaceTaskLists: false,
        workspaceTaskLists: action.payload.taskLists,
      };

    case ActionTypes.GET_WORKSPACE_TASKLISTS_FAILURE:
      return {
        ...state,
        isFetchingWorkspaceTaskLists: false,
      };

    case ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS_SUCCESS:
      return {
        ...state,
        archivedWorkspaceTaskLists: action.payload.taskLists,
      };

    case ActionTypes.SAVE_WORKSPACE_TASKLIST_REQUEST:
      return {
        ...state,
        isSavingWorkspaceTaskList: true,
      };

    case ActionTypes.ADD_WORKSPACE_TASKLIST_SUCCESS:
      return {
        ...state,
        isSavingWorkspaceTaskList: false,
        workspaceTaskLists: [...(state.workspaceTaskLists ?? []), action.payload],
      };

    case ActionTypes.UPDATE_WORKSPACE_TASKLIST_SUCCESS:
      return {
        ...state,
        isSavingWorkspaceTaskList: false,
        workspaceTaskLists: (state.workspaceTaskLists ?? []).map((list) =>
          list.taskListIdentifier === action.payload.taskListIdentifier
            ? action.payload
            : list
        ),
      };
    
    case ActionTypes.SAVE_WORKSPACE_TASKLIST_FAILURE:
      return {
        ...state,
        isSavingWorkspaceTaskList: false,
      };

    case ActionTypes.DELETE_WORKSPACE_TASKLIST_SUCCESS:
      return {
        ...state,
        workspaceTaskLists: state.workspaceTaskLists?.filter(
          (taskList) =>
            taskList.taskListIdentifier !== action.taskListIdentifier
        ),
      };

    case ActionTypes.LEAVE_WORKSPACE_TASKLIST_SUCCESS: {
      return {
        ...state,
        workspaceTaskLists: state.workspaceTaskLists?.filter(
          (taskList) =>
            taskList.taskListIdentifier !== action.taskListIdentifier
        ),
      };
    }

    case ActionTypes.ARCHIVE_WORKSPACE_TASKLIST_SUCCESS: {
      const archivedList = state.workspaceTaskLists.find(
        (list) => list.taskListIdentifier === action.payload.taskListIdentifier
      );

      return {
        ...state,
        archivedWorkspaceTaskLists: [
          ...(state.archivedWorkspaceTaskLists || []),
          archivedList,
        ],
        workspaceTaskLists: state.workspaceTaskLists.filter(
          (list) => list.taskListIdentifier !== action.payload.taskListIdentifier
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
