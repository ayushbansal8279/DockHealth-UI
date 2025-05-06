import React, { useState } from 'react';
import { ConfirmButton } from '@/app/modal/components/ModalButton/ModalButtons';
import {
  CloseIcon,
  CloseIconButton,
  ModalWrapper,
} from '@/app/modal/components/styled';
import { Box, TextField } from '@mui/material';
import { AddWorkspaceModalWrapper, InputSx, Title } from './styled';

interface AddWorkspaceModalProps {
  closeModal: () => void;
}

const AddWorkspaceModal: React.FC<AddWorkspaceModalProps> = ({
  closeModal,
}) => {
  const [workspace, setWorkspace] = useState({
    workspaceName: '',
    workspaceDescription: '',
  });

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWorkspace({ ...workspace, workspaceName: e.target.value });
  };

  const handleWorkspaceDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWorkspace({ ...workspace, workspaceName: e.target.value });
  };

  const handleAddWorkspace = () => {
    console.log('workspace', workspace);
    closeModal();
  };

  return (
    <AddWorkspaceModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>Add Workspace</Title>
      <Box m={2} />
      <TextField
        value={workspace.workspaceName}
        onChange={handleWorkspaceNameChange}
        variant="outlined"
        size="small"
        placeholder="Workspace name"
        sx={InputSx}
      />
      <Box m={1.5} />
      <TextField
        value={workspace.workspaceDescription}
        onChange={handleWorkspaceDescriptionChange}
        variant="outlined"
        size="small"
        placeholder="Workspace Description"
        sx={InputSx}
      />
      <Box m={1.5} />
      <ConfirmButton onClick={handleAddWorkspace} style={{ width: '100%' }}>
        Add workspace
      </ConfirmButton>
    </AddWorkspaceModalWrapper>
  );
};

export default AddWorkspaceModal;
