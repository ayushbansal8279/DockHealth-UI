import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { Container, StepsContainer } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  FlexButtonWrapper,
} from '../styled';
import ListSelectStep from './Steps/ListSelectStep';
import GroupSelectStep from './Steps/GroupSelectStep';
import ParentTaskSelectStep from './Steps/ParentTaskSelectStep';

const SelectTaskDestinationModal = ({
  closeModal,
  confirm,
  confirmText,
  tasksToMove = [],
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedParentTask, setSelectedParentTask] = useState(null);

  const [subtasksPresent, allTasksSameType] = useMemo(() => {
    let allSameType = true;
    let hasSubtasks = false;

    for (let i = 0; i < tasksToMove.length; i += 1) {
      if (!hasSubtasks) {
        hasSubtasks = !!tasksToMove[i].parentTaskIdentifier;
      }

      if (i !== 0) {
        allSameType =
          !!tasksToMove[i].parentTaskIdentifier ===
          !!tasksToMove[i - 1].parentTaskIdentifier;

        if (!allSameType) {
          break;
        }
      }
    }

    return [hasSubtasks, allSameType];
  }, [tasksToMove]);

  useEffect(() => {
    if (!allTasksSameType) {
      console.warn('All tasks to move must have the same type (subtask/task)');
      closeModal();
    }
  }, [allTasksSameType, closeModal]);

  const handleConfirm = useCallback(() => {
    if (!selectedList) return;

    const responseData = {
      taskListIdentifier: selectedList?.taskListIdentifier,
    };

    if (selectedGroup) {
      responseData.taskGroupIdentifier = selectedGroup.taskGroupIdentifier;
    }

    if (selectedParentTask) {
      responseData.parentTaskIdentifier = selectedParentTask.taskIdentifier;
    }

    if (typeof confirm === 'function') {
      confirm(responseData);
      closeModal();
    } else {
      console.warn('You have to provide confirm callback');
    }
  }, [confirm, selectedParentTask, selectedGroup, selectedList, closeModal]);

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
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            setNextStep={handleNextStep}
            closeModal={closeModal}
          />
          <GroupSelectStep
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            setPreviousStep={handlePreviousStep}
            subtasksPresent={subtasksPresent}
            setNextStep={handleNextStep}
          />
          {subtasksPresent && (
            <ParentTaskSelectStep
              selectedList={selectedList}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedParentTask={selectedParentTask}
              setSelectedParentTask={setSelectedParentTask}
              setPreviousStep={handlePreviousStep}
            />
          )}
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
            disabled={
              subtasksPresent
                ? !selectedList || !selectedGroup || !selectedParentTask
                : !selectedList
            }
            onClick={handleConfirm}
          >
            {confirmText || 'Save'}
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectTaskDestinationModal;
