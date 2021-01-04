import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { Container, StepsContainer } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';
import ListSelectStep from './ListSelectStep';
import GroupSelectStep from './GroupSelectStep';

const SelectTaskDestinationModal = ({ closeModal, confirm, task }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleConfirm = useCallback(() => {
    if (!selectedList) return;

    const responseData = {
      taskListIdentifier: selectedList?.taskListIdentifier,
    };
    if (selectedGroup) {
      responseData.taskGroupIdentifier = selectedGroup.taskGroupIdentifier;
    }
    if (typeof confirm === 'function') {
      confirm(responseData);
      closeModal();
    } else {
      console.warn('You have to provide confirm callback');
    }
  }, [confirm, selectedGroup, selectedList, closeModal]);

  const handleNextStep = useCallback(() => {
    setStepIndex(previousStepIndex => previousStepIndex + 1);
  }, []);

  const handlePreviousStep = useCallback(() => {
    setStepIndex(previousStepIndex => previousStepIndex - 1);
  }, []);

  return (
    <ModalWrapperWithPadding>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Container>
        <StepsContainer stepIndex={stepIndex}>
          <ListSelectStep
            currentTaskListIdentifier={task?.taskList?.taskListIdentifier}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            nextStep={handleNextStep}
            closeModal={closeModal}
          />
          <GroupSelectStep
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            previousStep={handlePreviousStep}
          />
        </StepsContainer>
      </Container>
      <Box m={2} />
      <Grid container direction="row">
        <FlexButtonWrapper>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </FlexButtonWrapper>
        <Box m={1} />
        <FlexButtonWrapper>
          <Button
            fullWidth
            size="small"
            disabled={!selectedList}
            onClick={handleConfirm}
          >
            Move
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectTaskDestinationModal;
