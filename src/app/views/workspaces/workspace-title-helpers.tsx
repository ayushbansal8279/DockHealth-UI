import React from 'react';
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';
import { StyledListLink } from '../workspace/styled';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';

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
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  if (embeddedMode) return '';

  if (isWorkspaceScoped) {
    return (
      <>
        <StyledListLink to="/core/workspace">{workspaceLabel}</StyledListLink>
        {' / '}
        {workspace?.workspaceIdentifier ? (
          <>
            <StyledListLink
              to={`/core/workspace/${workspace.workspaceIdentifier}`}
            >
              {workspace.workspaceName}
            </StyledListLink>
            {' / '}
          </>
        ) : null}
        {titleText}
      </>
    );
  }

  return titleText;
}
