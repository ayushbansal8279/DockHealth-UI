import React from 'react';
import { capitalize } from 'lodash';
import { StyledListLink } from '../workspace/styled';

export function getWorkspaceTitle({
  embeddedMode,
  isWorkspaceScoped,
  workspace,
  titleText,
}: {
  embeddedMode?: boolean;
  isWorkspaceScoped: boolean;
  workspace?: { workspaceName: string; workspaceIdentifier: string };
  titleText: string;
}): React.ReactNode {
  if (embeddedMode) return '';

  if (isWorkspaceScoped) {
    return (
      <>
        <StyledListLink to="/core/workspace">Workspace</StyledListLink>
        {' / '}
        {workspace?.workspaceIdentifier ? (
          <>
            <StyledListLink to={`/core/workspace/${workspace.workspaceIdentifier}`}>
              {workspace.workspaceName}
            </StyledListLink>
            {' / '}
          </>
        ) : null}
        {capitalize(titleText)}
      </>
    );
  }

  return capitalize(titleText);
}