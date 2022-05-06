import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { Container } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';
import GroupSelect from './Steps/GroupSelect';

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
        <GroupSelect
          selectedList={selectedList}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          onCreateGroup={onCreateGroup}
        />
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
            disabled={!selectedGroup}
            onClick={handleConfirm}
            size="small"
          >
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectDestinationGroupModal;
