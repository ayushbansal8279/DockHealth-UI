import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSearch from '@/app/components/template/HeaderSearch/HeaderSearch';
import { closeModal } from '../../actions';
import { addIntegrationToOrg, getAllDockIntegrations } from '@/app/api/integration-api';
import { CancelButton, 
    CloseIcon, 
    CloseIconButton, 
    ConfirmButton, 
    EmptyMessage, 
    FlexButtonWrapper, 
    ListItem, 
    ListItemTextButton, 
    ListsWrapper, 
    ModalWrapperWithPadding, 
    ScopeList,
    Step, 
    Title } from './styled';
import { Container } from '../styled';
import { selectedUserOrganizationSelector } from '@/app/selectors/user-selectors';


const DockIntegrationsModal = ({ onConfirm, confirmText = 'Confirm' }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [dockIntegrations,setDockIntegrations] = useState([]);
  const [selectedIntegration, setselectedIntegration] = useState({});
  const handleClose = () => dispatch(closeModal());
  const selectedOrganization = useSelector(selectedUserOrganizationSelector);

  useEffect(() => {
      const fetchIntegrations = async () => {
        try {
          const response = await getAllDockIntegrations();
          setDockIntegrations(response)
        } catch (error) {
          console.error();
        }
      };
      fetchIntegrations();
  }, []);

  const filteredDockIntegrations = dockIntegrations
    .filter(integration => integration.integrationName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.integrationName.localeCompare(b.integrationName));

  const handleSelectIntegration = (integration) => {
    setselectedIntegration(integration);
  };

  const handleConfirm = useCallback((selectedIntegration) =>{
    if (onConfirm) {
        onConfirm(selectedIntegration);
        const {
            identifier,
            ...rest
          } = selectedIntegration;
      
          const payload = {
            ...rest,
            dockIntegrationIdentifier: identifier,
            organizationIdentifier: selectedOrganization.organizationIdentifier,
            enabled: true
          };
        addIntegrationToOrg(payload);
    }
    handleClose();
  });

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={handleClose} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <Step>
          <Title>Select Integrations</Title>
          <Box m={1} />
          <Box sx={{ width: '100%', mx: 'auto' }}>
            <HeaderSearch onChange={setSearchQuery}/>
          </Box>
          <Box m={0.5} />
          <ListsWrapper>
            <ScopeList>
            {filteredDockIntegrations?.length > 0 ? (
                filteredDockIntegrations.map((integrations) => (
                    <ListItem
                      key={integrations.identifier}
                      isSelected={selectedIntegration?.identifier === integrations.identifier}
                    >
                        <ListItemTextButton
                            onClick={() => handleSelectIntegration(integrations)}
                            type="button"
                            isSelected={selectedIntegration?.identifier === integrations.identifier}
                            style={{
                                alignItems: 'center',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                        }}
                        >
                        {integrations.integrationName}
                        </ListItemTextButton>
                    </ListItem>
                    ))
                ) : (
                    <EmptyMessage>List is empty</EmptyMessage>
                )}
            </ScopeList>
          </ListsWrapper>
        </Step>
      </Container>
      <Box m={1} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <CancelButton
            style={{ width: '190px' }}
            fullWidth
            variant="secondary"
            onClick={handleClose}
            size="small"
          >
            Cancel
          </CancelButton>
          <Box m={1} />
          <ConfirmButton
            style={{ width: '190px' }}
            fullWidth
            disabled={!selectedIntegration?.identifier}
            size="small"
            onClick={() => handleConfirm(selectedIntegration)}
          >
            {confirmText || 'Save'}
          </ConfirmButton>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default DockIntegrationsModal;