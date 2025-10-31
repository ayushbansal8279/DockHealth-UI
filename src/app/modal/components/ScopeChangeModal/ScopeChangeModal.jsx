import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { showGlobalErrorAlert, showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { updatePatientScope } from 'api/patient-api';
import { getAllUserWorkspaces } from 'api/workspace-list-api';
import { getWorkspaceByIdentifier } from 'api/workspace-api';
import {
  CloseIconButton,
  CloseIcon,
  ModalWrapperWithPadding,
  ModalHeader,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const ScopeType = {
  ORGANIZATION: 'ORGANIZATION',
  WORKSPACE: 'WORKSPACE',
};

const ScopeChangeModal = ({
  closeModal,
  customField,
  workspaceIdentifier,
  onScopeChanged,
}) => {
  const dispatch = useDispatch();
  const [scope, setScope] = useState('organization');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesLoaded, setWorkspacesLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  const organizationIdentifier = sessionStorage.getItem(
    'currentOrganizationIdentifier',
  );

  const currentScope = workspaceIdentifier
    ? ScopeType.WORKSPACE
    : ScopeType.ORGANIZATION;

  const isPatient = customField?.patientIdentifier !== undefined;
  const entityIdentifier = isPatient
    ? customField?.patientIdentifier
    : customField?.identifier;

  const fetchWorkspaces = useCallback(async () => {
    if (workspacesLoaded) return;

    try {
      const workspaceData = await getAllUserWorkspaces();
      setWorkspaces(workspaceData);
      setWorkspacesLoaded(true);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      dispatch(showGlobalErrorAlert());
    }
  }, [workspacesLoaded, dispatch]);

  useEffect(() => {
    if (currentScope === ScopeType.WORKSPACE) {
      setScope('workspace');
      setSelectedWorkspace(workspaceIdentifier);
      fetchWorkspaces();
    } else {
      setScope('organization');
    }
  }, [currentScope, workspaceIdentifier]);

  const handleScopeChange = useCallback(
    async (newScope) => {
      setScope(newScope);

      if (newScope === 'workspace') {
        await fetchWorkspaces();
        if (workspaceIdentifier) {
          setSelectedWorkspace(workspaceIdentifier);
        }
      } else {
        setSelectedWorkspace('');
      }
    },
    [fetchWorkspaces, workspaceIdentifier],
  );

  const handleWorkspaceChange = useCallback((workspaceIdentifier) => {
    setSelectedWorkspace(workspaceIdentifier);
  }, []);

  const handleUpdateScope = useCallback(async () => {
    if (!entityIdentifier) return;

    const newScopeType =
      scope === 'workspace' ? ScopeType.WORKSPACE : ScopeType.ORGANIZATION;
    const scopeIdentifier =
      scope === 'workspace' ? selectedWorkspace : organizationIdentifier;

    if (
      newScopeType === currentScope &&
      scopeIdentifier === (workspaceIdentifier || organizationIdentifier)
    ) {
      closeModal();
      return;
    }

    setIsUpdating(true);

    try {
      const payload = {
        scopeIdentifier,
        scopeType: newScopeType,
      };

      if (isPatient) {
        await updatePatientScope(entityIdentifier, payload);
      } else {
        await CustomFieldsApi.updateCustomFieldScope(entityIdentifier, payload);
      }

      dispatch(showGlobalAlert(AlertMessages.UPDATED));

      onScopeChanged?.(newScopeType, scopeIdentifier);

      closeModal();
    } catch (error) {
      console.error(
        `Error updating ${isPatient ? 'patient' : 'field'} scope:`,
        error,
      );
      dispatch(showGlobalErrorAlert());
    } finally {
      setIsUpdating(false);
    }
  }, [
    entityIdentifier,
    isPatient,
    scope,
    selectedWorkspace,
    currentScope,
    workspaceIdentifier,
    organizationIdentifier,
    dispatch,
    onScopeChanged,
    closeModal,
  ]);

  return (
    <ModalWrapperWithPadding width="500px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>

      <ModalHeader>
        {isPatient ? 'Change Patient Scope' : 'Change Field Scope'}
      </ModalHeader>

      <Box sx={{ mt: 3 }}>
        <FormControl component="fieldset" size="small" fullWidth>
          <FormLabel component="legend">
            {isPatient ? 'Patient Scope' : 'Field Scope'}
          </FormLabel>
          <RadioGroup
            row
            value={scope}
            onChange={(e) => handleScopeChange(e.target.value)}
          >
            <FormControlLabel
              value="workspace"
              control={<Radio />}
              label="Workspace"
            />
            <FormControlLabel
              value="organization"
              control={<Radio />}
              label="Organization"
            />
          </RadioGroup>

          {scope === 'workspace' && (
            <Box mt={2}>
              <FormControl fullWidth size="small">
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Select Workspace
                </FormLabel>
                <Select
                  value={selectedWorkspace}
                  onChange={(e) => handleWorkspaceChange(e.target.value)}
                  displayEmpty
                  renderValue={(value) => {
                    if (!value) return 'Choose a workspace';
                    const workspace = workspaces.find(
                      (ws) => ws.workspaceIdentifier === value,
                    );
                    return workspace ? workspace.workspaceName : '';
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      '&.Mui-focused fieldset': {
                        borderColor: 'black',
                        borderWidth: '1px',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'grey',
                    },
                  }}
                  MenuProps={{
                    disablePortal: true,
                    container: () => document.body,
                    PaperProps: {
                      sx: {
                        position: 'absolute',
                        zIndex: 99999,
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Choose a workspace
                  </MenuItem>
                  {workspaces.map((workspace) => (
                    <MenuItem
                      key={workspace.workspaceIdentifier}
                      value={workspace.workspaceIdentifier}
                    >
                      {workspace.workspaceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </FormControl>
      </Box>

      <Box m={2} />
      <Grid container justifyContent="flex-end">
        <CancelButton
          width="auto"
          variant="secondary"
          onClick={closeModal}
          disabled={isUpdating}
        >
          Cancel
        </CancelButton>
        <Box m={1} />
        <ConfirmButton
          width="auto"
          onClick={handleUpdateScope}
          disabled={isUpdating || (scope === 'workspace' && !selectedWorkspace)}
        >
          {isUpdating ? 'Updating...' : 'Update Scope'}
        </ConfirmButton>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default ScopeChangeModal;
