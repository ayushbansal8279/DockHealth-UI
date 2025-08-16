import React, { useEffect, useState } from 'react';
import {
  WorkspacesTitle,
  WorkspacesTitleWrapper,
  WorkspaceSettingsIcon,
  AddworkspaceButton,
  WorkspacesSubWrapper,
  WorkspaceWrapper,
  WorkspaceSubWrapper,
  MoreVertIcon,
  ArrowForwardIcon,
  WorkspaceTitle,
  Spacing,
  DrawerListsItemLoader,
} from './styled';
import SettingsIcon from 'img/settings-icon.svg';
import { useHistory } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '@/app/modal/actions';
import { Workspace } from '@/app/types/workspace';
import WorkspaceSubmenuStepTwo from './WorkspaceSubmenuStepTwo';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import {
  isFetchingWorkspaceListSelector,
  workspaceListSelector,
} from '@/app/selectors/workspace-list-selector';
import { getAllUserWorkspaces } from '@/app/actions/workspace-list-actions';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import pluralize from 'pluralize';
import WorkspaceOptionsMenu from '@/app/components/workspace/WorkspaceOptionsMenu/WorkspaceOptionsMenu';

const WorkspacesSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const workspaces = useSelector(workspaceListSelector);
  const isFetching = useSelector(isFetchingWorkspaceListSelector);
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);
  const [showStepTwo, setShowStepTwo] = useState(
    !!workspace?.workspaceIdentifier,
  );
  const [menuOptionsOpen, setMenuOptionsOpen] = useState(false);

  const openAddWorkspaceModal = () => {
    const modalProps = {
      onConfirm: async (createdWorkspace: Workspace) => {
        dispatch(closeModal());
        handleWorkspaceSelect(createdWorkspace.workspaceIdentifier);
      },
    };
    dispatch(openModal('AddWorkspace', modalProps));
  };

  useEffect(() => {
    dispatch(getAllUserWorkspaces());
  }, []);

  const handleWorkspaceSelect = (workspaceIdentifier: string) => {
    setShowStepTwo(true);
    history.push(`/core/workspace/${workspaceIdentifier}`);
  };

  return (
    <>
      {!showStepTwo ? (
        <>
          <WorkspacesTitleWrapper>
            <WorkspacesTitle>{pluralize(workspaceLabel)}</WorkspacesTitle>
            <WorkspacesSubWrapper>
              <WorkspaceSettingsIcon
                src={SettingsIcon}
                alt=""
                onClick={() => {
                  history.push('/settings/workspaces/configure');
                }}
              />
              <ToolbarButton
                icon={
                  <span style={{ marginLeft: '-5px' }}>
                    <Add />
                  </span>
                }
                onClick={openAddWorkspaceModal}
              >
                <span style={{ marginLeft: '-5px' }}>New</span>
              </ToolbarButton>
            </WorkspacesSubWrapper>
          </WorkspacesTitleWrapper>
          <Spacing />
          <>
            {isFetching ? (
              Array.from({ length: 6 })
                .fill(undefined)
                .map((_, index) => <DrawerListsItemLoader key={index} />)
            ) : (
              <>
                {workspaces.map((workspace: Workspace) => (
                  <WorkspaceWrapper key={workspace.workspaceIdentifier}>
                    <WorkspaceOptionsMenu
                      onClose={() => setMenuOptionsOpen(false)}
                      open={menuOptionsOpen}
                      selectedWorkspace={workspace}
                    >
                      <MoreVertIcon onClick={() => setMenuOptionsOpen(true)} />
                    </WorkspaceOptionsMenu>
                    <WorkspaceTile
                      workspaceProfileColor={workspace.workspaceProfileColor}
                      workspaceInitials={workspace.workspaceInitials}
                    />
                    <WorkspaceSubWrapper
                      onClick={() =>
                        handleWorkspaceSelect(workspace.workspaceIdentifier)
                      }
                    >
                      <WorkspaceTitle>{workspace.workspaceName}</WorkspaceTitle>
                      <ArrowForwardIcon />
                    </WorkspaceSubWrapper>
                  </WorkspaceWrapper>
                ))}
              </>
            )}
          </>
        </>
      ) : (
        <WorkspaceSubmenuStepTwo setShowStepTwo={setShowStepTwo} />
      )}
    </>
  );
};

export default WorkspacesSubmenu;
