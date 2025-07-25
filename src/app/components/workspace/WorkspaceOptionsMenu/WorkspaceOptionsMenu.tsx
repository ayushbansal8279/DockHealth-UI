import React, { useCallback } from 'react';
import OptionsMenu from '../../common/OptionsMenu/OptionsMenu';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/app/modal/actions';
import { Workspace } from '@/app/types/workspace';
import { useHistory } from 'react-router-dom';
import { showGlobalAlert, showGlobalErrorAlert } from '@/app/alert/actions';
import AlertMessages from '@/app/alert/AlertMessages';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import { deleteWorkspaceAction } from '@/app/actions/workspace-list-actions';

interface Prop {
  children: any;
  open: boolean;
  selectedWorkspace: Workspace;
  onClose: () => void;
}
const WorkspaceOptionsMenu = ({
  children,
  open,
  onClose,
  selectedWorkspace,
}: Prop) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  const handleWorkspaceEdit = () => {
    const modalProps = {
      selectedWorkspace,
      onConfirm: () => {
        dispatch(showGlobalAlert(AlertMessages.UPDATED));
      },
    };
    dispatch(openModal('AddWorkspace', modalProps));
  };

  const handleWorkspaceDelete = useCallback(() => {
    const modalProps = {
      title: `Delete ${workspaceLabel}`,
      description: `Are you sure you want to delete this ${workspaceLabel}? This action cannot be undone.`,
      confirm: async () => {
        try {
          dispatch(deleteWorkspaceAction(selectedWorkspace.workspaceIdentifier));
          // history.push(`/core/home/my-tasks`);
        } catch {
          dispatch(showGlobalErrorAlert());
        }
      },
    };
    dispatch(openModal('DeleteConfirmation', modalProps));
  }, [selectedWorkspace, dispatch]);

  const options = [
    { name: 'Edit', onClick: () => handleWorkspaceEdit() },
    { name: 'Delete', onClick: () => handleWorkspaceDelete() },
  ];

  return (
    <OptionsMenu
      placement="bottom-start"
      options={options}
      onClose={onClose}
      open={open}
      footer={undefined}
      color={undefined}
      setOptionActive={undefined}
    >
      {children}
    </OptionsMenu>
  );
};

export default WorkspaceOptionsMenu;
