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
import { organizationWorkspaceLabelSelector } from '@/app/selectors/organization-selectors';
import { updateWorkspaceAction } from '@/app/actions/workspace-list-actions';
import { ColorPickerHeader, TileSettingsDescription, TileSettingsHeader } from '@/app/modal/components/EditOrganizationModal/styled';
import Spacing from '../../common/Spacing';
import InitialsInput from '../../common/InitialsInput/InitialsInput';
import ColorPicker from '../../common/ColorPicker/ColorPicker';

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
    workspaceInitials: '',
    workspaceProfileColor: '',
  });

  const isEdit = Boolean(selectedWorkspace?.workspaceIdentifier);

  useEffect(() => {
    if (isEdit) {
      setWorkspace({
        workspaceIdentifier: selectedWorkspace.workspaceIdentifier,
        workspaceName: selectedWorkspace.workspaceName,
        workspaceInitials: selectedWorkspace.workspaceInitials,
        workspaceProfileColor: selectedWorkspace.workspaceProfileColor
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

  const handleInitialsChange = (val: string) => {
    setWorkspace((prev) => ({ ...prev, workspaceInitials: val }));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspace((prev) => ({ ...prev, workspaceProfileColor: e.target.value }));
  };

  const handleAddWorkspace = async () => {
    const payload = {
      workspaceIdentifier: workspace.workspaceIdentifier,
      parentOrganizationIdentifier: selectedOrganization.organizationIdentifier,
      workspaceName: workspace.workspaceName,
      workspaceInitials: workspace.workspaceInitials,
      workspaceProfileColor: workspace.workspaceProfileColor
    };
    if (isEdit) {
      dispatch(updateWorkspaceAction(payload));
      closeModal();
    } else {
      createWorkspace(payload).then((createdWorkspace: Workspace) => {
        onConfirm(createdWorkspace);
        closeModal();
      })
    }
  };

  return (
    <AddWorkspaceModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>
        {isEdit ? 'Edit' : 'Add'} {workspaceLabel}
      </Title>
      <Spacing vertical={4} />
      <TextField
        value={workspace.workspaceName}
        onChange={handleWorkspaceNameChange}
        variant="outlined"
        size="small"
        placeholder={`${workspaceLabel} name`}
        sx={InputSx}
      />
      <Spacing vertical={4} />
      <TileSettingsHeader>Create your workspace tile</TileSettingsHeader>
      <Spacing vertical={3} />
      <TileSettingsDescription>2-3 initials to represent your workspace</TileSettingsDescription>
      <Spacing vertical={3} />
      <InitialsInput
        name="initials"
        placeholder="abc"
        value={workspace.workspaceInitials}
        backgroundColor={workspace.workspaceProfileColor}
        onChange={handleInitialsChange}
      />
      <Spacing vertical={4} />
      <ColorPickerHeader>Choose a theme color</ColorPickerHeader>
      <Spacing vertical={2} />
      <ColorPicker 
        name="profileColor" 
        value={workspace.workspaceProfileColor} 
        onChange={handleColorChange} 
      />
      <Spacing vertical={5} />
      <ConfirmButton onClick={handleAddWorkspace} style={{ width: '100%' }}>
        Save
      </ConfirmButton>
    </AddWorkspaceModalWrapper>
  );
};

export default AddWorkspaceModal;
