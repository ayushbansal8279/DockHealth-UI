import React, { useEffect, useState } from 'react';
import { ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';
import {
  CloseIcon,
  CloseIconButton,
  ModalWrapper,
} from '@/app/modal/components/styled';
import { Box, TextField } from '@mui/material';
import { AddWorkspaceModalWrapper, InputSx, Title } from './styled';
import { createWorkspace } from '@/app/api/workspace-api';
import { selectedUserOrganizationSelector } from '@/app/selectors/user-selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Workspace } from '@/app/types/workspace';
import { updateSelectedWorkspace } from '@/app/actions/workspace-actions';
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';

interface AddWorkspaceModalProps {
  selectedWorkspace: Workspace;
  closeModal: () => void;
  onConfirm: (createdWorkspace: Workspace) => void;
}

const AddWorkspaceModal: React.FC<AddWorkspaceModalProps> = ({
  closeModal,
  onConfirm,
  selectedWorkspace,
}) => {
  const dispatch = useDispatch();
  const [workspace, setWorkspace] = useState({
    workspaceIdentifier: '',
    workspaceName: '',
  });

  const isEdit = Boolean(selectedWorkspace?.workspaceIdentifier);

  useEffect(() => {
    if (isEdit) {
      setWorkspace({
        workspaceIdentifier: selectedWorkspace.workspaceIdentifier,
        workspaceName: selectedWorkspace.workspaceName,
      });
    }
  }, []);
  const selectedOrganization = useSelector(selectedUserOrganizationSelector);
  const workspaceLabel = useSelector(organizationWorkspaceLabelSelector);

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWorkspace({ ...workspace, workspaceName: e.target.value });
  };

  const handleAddWorkspace = async () => {
    const payload = {
      workspaceIdentifier: workspace.workspaceIdentifier,
      parentOrganizationIdentifier: selectedOrganization.organizationIdentifier,
      workspaceName: workspace.workspaceName,
    };
    if (isEdit) {
      dispatch(updateSelectedWorkspace(payload));
      closeModal();
      return;
    }
    const createdWorkspace: Workspace = await createWorkspace(payload);
    onConfirm(createdWorkspace);
    closeModal();
  };

  return (
    <AddWorkspaceModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>
        {isEdit ? 'Edit' : 'Add'} {workspaceLabel}
      </Title>
      <Box m={2} />
      <TextField
        value={workspace.workspaceName}
        onChange={handleWorkspaceNameChange}
        variant="outlined"
        size="small"
        placeholder={`${workspaceLabel} name`}
        sx={InputSx}
      />
      <Box m={1.5} />
      <ConfirmButton onClick={handleAddWorkspace} style={{ width: '100%' }}>
        {isEdit ? 'Edit' : 'Add'} {workspaceLabel}
      </ConfirmButton>
    </AddWorkspaceModalWrapper>
  );
};

export default AddWorkspaceModal;
