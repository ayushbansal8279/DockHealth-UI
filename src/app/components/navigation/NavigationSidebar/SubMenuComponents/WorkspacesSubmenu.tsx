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
import { getAllUserWorkspaces } from '@/app/api/workspace-api';
import { Workspace } from '@/app/types/workspace';
import WorkspaceSubmenuStepTwo from './WorkspaceSubmenuStepTwo';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';
import WorkspaceTile from '@/app/components/workspace/WorkspaceTile/WorkspaceTile';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';

const WorkspacesSubmenu = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const workspace = useSelector(workspaceSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

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
    (async () => {
      const workspaces = await getAllUserWorkspaces();
      setWorkspaces(workspaces);
      setLoading(false);
    })();
  }, []);

  const handleWorkspaceSelect = (workspaceIdentifier: string) => {
    history.push(`/core/workspace/${workspaceIdentifier}`);
  };

  return (
    <>
      {!workspace.workspaceIdentifier ? (
        <>
          <WorkspacesTitleWrapper>
            <WorkspacesTitle>{workspaceLabel}s</WorkspacesTitle>
            <WorkspacesSubWrapper>
              <WorkspaceSettingsIcon
                src={SettingsIcon}
                alt=""
                onClick={() => {
                  history.push('/settings/workspaces/configure');
                }}
              />
              <AddworkspaceButton onClick={openAddWorkspaceModal}>
                <Add sx={{ height: '22px' }} /> New
              </AddworkspaceButton>
            </WorkspacesSubWrapper>
          </WorkspacesTitleWrapper>
          <Spacing />
          <>
            {loading ? (
              Array.from({ length: 6 })
                .fill(undefined)
                .map((_, index) => <DrawerListsItemLoader key={index} />)
            ) : (
              <>
                {workspaces.map((workspace) => (
                  <WorkspaceWrapper>
                    <MoreVertIcon />
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
        <WorkspaceSubmenuStepTwo />
      )}
    </>
  );
};

export default WorkspacesSubmenu;
