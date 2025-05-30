import { createSelector } from 'reselect';
import { Workspace } from '../types/workspace';

export const workspaceSelector = (state: { workspace: Workspace }) =>
  state.workspace;

export const workspaceNameSelector = createSelector(
  workspaceSelector,
  ({ workspaceName }) => workspaceName,
);
