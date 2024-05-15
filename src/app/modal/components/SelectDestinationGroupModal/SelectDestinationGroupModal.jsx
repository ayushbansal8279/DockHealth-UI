import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import Button from 'components/common/Button/Button';
import { Container } from './styled';
import GroupPicker from '../common/GroupPicker/GroupPicker';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const SelectDestinationGroupModal = ({
  closeModal,
  confirm,
  preventClosingModal = false,
  selectedList,
  onCreateGroup,
}) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleConfirm = useCallback(() => {
    if (typeof confirm === 'function') {
      confirm(selectedGroup);
      if (!preventClosingModal) closeModal();
    }
  }, [confirm, selectedGroup, preventClosingModal, closeModal]);

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <GroupPicker
          selectedList={selectedList}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          onCreateGroup={onCreateGroup}
        />
      </Container>
      <Box m={2} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <CancelButton
            style={{ width: '180px' }}
            fullWidth
            variant="secondary"
            onClick={closeModal}
            size="small"
          >
            Cancel
          </CancelButton>
          <Box m={1} />
          <ConfirmButton
            style={{ width: '190px' }}
            fullWidth
            disabled={!selectedGroup}
            onClick={handleConfirm}
            size="small"
          >
            Move
          </ConfirmButton>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectDestinationGroupModal;
