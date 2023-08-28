import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import { Container, StepsContainer } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';
import SelectStep from './Steps/SelectStep';

const SelectDestinationModal = ({
  closeModal,
  confirmText,
  confirm,
  onAddFolderCallback,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleConfirm = useCallback(() => {
    confirm(selectedFolder);
    closeModal();
  }, [selectedFolder, confirm, closeModal]);

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <StepsContainer>
          <SelectStep
            selectedFolder={selectedFolder}
            setSelectedFolder={setSelectedFolder}
            onAddFolderCallback={onAddFolderCallback}
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
            disabled={selectedFolder === null}
            onClick={handleConfirm}
            size="small"
          >
            {confirmText || 'Save'}
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectDestinationModal;
