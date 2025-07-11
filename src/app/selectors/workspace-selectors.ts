import { createSelector } from 'reselect';
import { Workspace } from '../types/workspace';

export const workspaceSelector = (state: { workspace: Workspace }) =>
  state.workspace;

export const workspaceNameSelector = createSelector(
  workspaceSelector,
  ({ workspaceName }) => workspaceName,
);

export const workspaceUsersSelector = (state: { workspace: Workspace }) => state.workspace.workspaceUsers;

export const isFetchingWorkspaceUsersSelector = (state: { workspace: Workspace }) => state.workspace.isFetchingWorkspaceUsers;

export const workspaceTaskListsSelector = createSelector(
  workspaceSelector,
  ({ workspaceTaskLists }) => workspaceTaskLists ?? [],
);

export const isFetchingWorkspaceTaskListsSelector = createSelector(
  workspaceSelector,
  ({ isFetchingWorkspaceTaskLists }) => isFetchingWorkspaceTaskLists,
);

export const archivedWorkspaceTaskListsSelector = createSelector(
  workspaceSelector,
  ({ archivedWorkspaceTaskLists }) => archivedWorkspaceTaskLists ?? [],
);