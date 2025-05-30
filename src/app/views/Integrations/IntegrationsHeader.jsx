import { getEnabledDockIntegrationsForOrg, updateIntegrationToOrg } from '@/app/api/integration-api';
import ViewLayout from '@/app/components/template/ViewLayout/ViewLayout'
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import BasicLayoutHeader from '@/app/components/template/BasicLayoutHeader/BasicLayoutHeader';
import { openModal , closeModal } from '@/app/modal/actions';
import EditPencil from '@/app/img/EditPencil';
import IntegrationFields from './IntegrationFields';

export default function IntegrationsHeader() {
  const dispatch = useDispatch();

  const [enabledIntegration, setEnabledIntegration] = useState([]);
  const [editStates, setEditStates] = useState({});
  const [fieldValues, setFieldValues] = useState({});

  const openIntegrationModal = useCallback(() => {
    dispatch(openModal('DockIntegrations', { onConfirm: handleIntegrationConfirm }));
  }, [dispatch]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const enabledIntegrationResponse = await getEnabledDockIntegrationsForOrg();
        setEnabledIntegration(enabledIntegrationResponse);

        const initialFieldValues = {};
        enabledIntegrationResponse.forEach((integration) => {
          const fields = integration.settingsTemplate?.authInfo || [];
          initialFieldValues[integration.identifier] = fields.reduce((acc, field) => {
            acc[field.key] = '';
            return acc;
          }, {});
        });
        setFieldValues(initialFieldValues);
      } catch (error) {
        console.log(error);
      }
    };
    fetchIntegrations();
  }, []);

  const handleIntegrationConfirm = useCallback((integrationData) => {

    setEnabledIntegration((prev) => {
      const alreadyExists = prev.some(i => i.identifier === integrationData.identifier);
      if (alreadyExists) return prev;
      return [...prev, integrationData];
    });

    const authFields = integrationData.settingsTemplate?.authInfo || [];
    setFieldValues((prev) => ({
      ...prev,
      [integrationData.identifier]: authFields.reduce((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {}),
    }));

    setEditStates((prev) => ({
      ...prev,
      [integrationData.identifier]: true,
    }));
  }, []);
  

  const toggleEditMode = (identifier) => {
    setEditStates((prev) => ({ ...prev, [identifier]: !prev[identifier] }));
  };

  const handleFieldChange = (integrationId, key, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [key]: value,
      },
    }));
  };

  const handleToggleEnabled = (integrationId, newStatus) => {
    const integration = enabledIntegration.find(i => i.identifier === integrationId);
    const actionLabel = newStatus ? 'enable' : 'disable';
  
    dispatch(
      openModal('Confirmation', {
        title: `Confirm ${actionLabel}`,
        description: `Are you sure you want to ${actionLabel} the integration "${integration.integrationName}"?`,
        timeout: 5000,
        confirm: async () => {
          dispatch(closeModal());
          try{
            await updateIntegrationToOrg({
              enabled: newStatus,
              integrationCode:  integration.integrationCode,
              integrationName: integration.integrationName
            })
            setEnabledIntegration(prev =>
              prev.map(i =>
                i.identifier === integrationId ? { ...i, enabled: newStatus } : i
              )
            );
          }
          catch(error){ console.error }
        },
      })
    );
  };
  
  const handleSave = (integrationId) => {
    //use api to save integration settings 
    console.log('Saved values for', integrationId, fieldValues[integrationId]);
    toggleEditMode(integrationId);
  };

  return (
    <ViewLayout header={<BasicLayoutHeader title="Integrations" />}>
      <Box sx={{ p: 5, pl: 15, pr: 15, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <LoadingButton
            onClick={openIntegrationModal}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Integration
          </LoadingButton>
        </Box>

        {enabledIntegration.map((integration) => {
          const fields = integration.settingsTemplate?.authInfo || [];
          const isEditing = !!editStates[integration.identifier];
          const values = fieldValues[integration.identifier] || {};

          return (
            <Card key={integration.identifier} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h3">{integration.integrationName}</Typography>
                <Box>
                  <IconButton onClick={() => toggleEditMode(integration.identifier)}>
                    <Tooltip placement="top" title={isEditing ? 'Cancel' : 'Edit Integration'}>
                      <EditPencil />
                    </Tooltip>
                  </IconButton>
                  <Switch
                    checked={!!integration.enabled}
                    onChange={(e) => handleToggleEnabled(integration.identifier, e.target.checked)}
                    inputProps={{ 'aria-label': 'Enable Integration' }}
                  />
                </Box>
              </Box>
                  
              {fields.map((field) => (
                <IntegrationFields
                  key={field.key}
                  label={field.name}
                  value={values[field.key]}
                  // ellipsis={!isEditing}
                  editable={isEditing}
                  onChange={(e) => handleFieldChange(integration.identifier, field.key, e.target.value)}
                />
              ))}

              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    onClick={() => toggleEditMode(integration.identifier)}
                    variant="outlined"
                    color="inherit"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSave(integration.identifier)}
                    variant="contained"
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Card>
          );
        })}
      </Box>
    </ViewLayout>
  );
}

