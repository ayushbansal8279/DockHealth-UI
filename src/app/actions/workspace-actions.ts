import * as ActionTypes from 'actions/action-types';
import { ChangeUserRolePayload, createWorkspacePayload, InvitePersonToWorkspacePayload, InviteUserToWorkspacePayload, RemoveUserFromWorkspacePayload } from '../types/workspace';
import { Dispatch } from 'redux';

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

export function getWorkspaceUsers(workspaceIdentifier: string) {
  return {
    type: ActionTypes.GET_WORKSPACE_USERS,
    workspaceIdentifier,
  }
}

export function changeWorkspaceUserRole(payload: ChangeUserRolePayload) {
  return {
    type: ActionTypes.CHANGE_WORKSPACE_USER_ROLE,
    payload,
  };
}

export function inviteUserToWorkspace(payload: InviteUserToWorkspacePayload) {
  return {
    type: ActionTypes.INVITE_USER_TO_WORKSPACE,
    payload,
  };
}

export function removeUserFromWorkspace(payload: RemoveUserFromWorkspacePayload) {
  return {
    type: ActionTypes.REMOVE_USER_FROM_WORKSPACE,
    payload,
  };
}

export function invitePersonToWorkspace(payload: InvitePersonToWorkspacePayload) {
  return {
    type: ActionTypes.INVITE_PERSON_TO_WORKSPACE,
    payload,
  };
}

// Workspace List

export function getWorkspaceTaskLists(workspaceIdentifier: string) {
  return {
    type: ActionTypes.GET_WORKSPACE_TASKLISTS,
    payload: {
      workspaceIdentifier,
    },
  };
}

export function getArchivedWorkspaceTaskLists(workspaceIdentifier: string) {
  return {
    type: ActionTypes.GET_ARCHIVED_WORKSPACE_TASKLISTS,
    payload: {
      workspaceIdentifier
    },
  };
}

export function saveWorkspaceTaskList(formProps: any) {
  return (dispatch: Dispatch) =>
    new Promise((resolve, reject) => {
      dispatch({
        type: ActionTypes.SAVE_WORKSPACE_TASKLIST,
        payload: {
          formProps,
          onSuccess: resolve,
          onFailure: reject,
        },
      });
    });
}

export function deleteWorkspaceTaskListById(taskListIdentifier: string) {
  return {
    type: ActionTypes.DELETE_WORKSPACE_TASKLIST,
    payload: {
      taskListIdentifier,
    },
  };
}

export function leaveWorkspaceTaskList(taskListIdentifier: string) {
  return {
    type: ActionTypes.LEAVE_WORKSPACE_TASKLIST,
    payload: {
      taskListIdentifier,
    },
  };
}

export function archiveWorkspaceTaskList(taskListIdentifier: string) {
  return {
    type: ActionTypes.ARCHIVE_WORKSPACE_TASKLIST,
    payload: {
      taskListIdentifier,
    },
  };
}