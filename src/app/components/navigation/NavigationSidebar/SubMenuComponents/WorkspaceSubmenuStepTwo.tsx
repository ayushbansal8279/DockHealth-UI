import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';
import {
  ArrowBackIcon,
  WorkspacesTitleWrapper,
  WorkspacesTitle,
  WorkspacesSubWrapper,
} from './styled';
import { clearWorkspaceState } from '@/app/actions/workspace-actions';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import { Flex } from '@/app/components/common/Flex/styled';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';

const WorkspaceSubmenuStepTwo = () => {
  const dispatch = useDispatch();
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  const handleBackClick = () => {
    dispatch(clearWorkspaceState());
  };

  return (
    <>
      <WorkspacesTitleWrapper>
        <WorkspacesSubWrapper>
          <ArrowBackIcon onClick={handleBackClick} />
          <WorkspacesTitle>{workspaceLabel}s</WorkspacesTitle>
        </WorkspacesSubWrapper>
      </WorkspacesTitleWrapper>
      <Flex j={'start'} gap={10} pl={10} pt={10}>
        <WorkspaceTile
          workspaceProfileColor={workspace.workspaceProfileColor}
          workspaceInitials={workspace.workspaceInitials}
        />
        <div>{workspace.workspaceName}</div>
      </Flex>
    </>
  );
};

export default WorkspaceSubmenuStepTwo;
