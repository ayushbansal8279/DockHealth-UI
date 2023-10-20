import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import OrganizationSelectStep from './Steps/OrganizationSelectStep';
import { Container, StepsContainer } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';

const SelectOrganizationModal = ({
  closeModal,
  confirm,
  confirmText,
  preventClosingModal = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  // const dispatch = useDispatch();
  const [selectedOrganizations, setSelectedOrganizations] = useState(new Set());

  const handleConfirm = useCallback(() => {
    const responseData = {
      organizations: Array.from(selectedOrganizations),
    };

    if (typeof confirm === 'function') {
      confirm(responseData);
      if (!preventClosingModal) closeModal();
    } else {
      console.warn('You have to provide confirm callback');
    }
  }, [selectedOrganizations, confirm, preventClosingModal, closeModal]);

  const handleConfirmWrapper = useCallback(async () => {
    handleConfirm();
  }, [handleConfirm]);

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <StepsContainer stepIndex={0}>
          <OrganizationSelectStep
            selectedOrganizations={selectedOrganizations}
            setSelectedOrganizations={setSelectedOrganizations}
            closeModal={closeModal}
          />
        </StepsContainer>
      </Container>
      <Box m={2} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <Button
            fullWidth
            variant="secondary"
            onClick={closeModal}
            size="small"
          >
            Cancel
          </Button>
        </FlexButtonWrapper>
        <Box m={1} />
        <FlexButtonWrapper>
          <Button
            fullWidth
            disabled={!selectedOrganizations}
            onClick={handleConfirmWrapper}
            size="small"
          >
            {confirmText || 'Save'}
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectOrganizationModal;
