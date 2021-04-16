import React, { useState, useCallback, useRef } from 'react';
import { Box, Grid } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { getTaskListForUser } from 'actions/task-list-actions';
import { addTaskList } from 'api/task-list-api';
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

const SelectDestinationModal = ({
  closeModal,
  confirm,
  confirmText,
  preventClosingModal = false,
  subtasksPresent,
  movingContentType = 'TASK',
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedParentTask, setSelectedParentTask] = useState(null);

  const addListInput = useRef(null);
  const [lists, setLists] = useState(null);
  const [savingList, setSavingList] = useState(false);
  const currentUser = useSelector(userProfileSelector);

  const handleAddNewList = useCallback(
    async (listName, callback) => {
      if (savingList || !listName) return;

      setSavingList(true);
      // eslint-disable-next-line sonarjs/prefer-immediate-return
      await addTaskList({
        adminIdentifiers: [currentUser.userIdentifier],
        listName,
      })
        .then(createdList => {
          setSavingList(false);
          setSelectedList(createdList);
          setLists(previousLists => setLists([...previousLists, createdList]));
          addListInput.current.value = '';
          dispatch(getTaskListForUser());
          callback(createdList);
        })
        .catch(() => {
          setSavingList(false);
        });
    },
    [currentUser.userIdentifier, dispatch, savingList],
  );

  const handleConfirm = useCallback(
    createdList => {
      const taskList = createdList || selectedList;

      if (!taskList) return;

      const responseData = {
        taskListIdentifier: taskList?.taskListIdentifier,
      };

      if (movingContentType === 'TASK') {
        if (selectedGroup) {
          responseData.taskGroupIdentifier = selectedGroup.taskGroupIdentifier;
        }

        if (selectedParentTask) {
          responseData.parentTaskIdentifier = selectedParentTask.taskIdentifier;
        }
      }

      if (movingContentType === 'BUNDLE' && selectedGroup) {
        responseData.parentTaskGroupIdentifier =
          selectedGroup.taskGroupIdentifier;
      }
      if (typeof confirm === 'function') {
        confirm(responseData);
        if (!preventClosingModal) closeModal();
      } else {
        console.warn('You have to provide confirm callback');
      }
    },
    [
      selectedList,
      movingContentType,
      selectedGroup,
      confirm,
      selectedParentTask,
      preventClosingModal,
      closeModal,
    ],
  );

  const handleConfirmWrapper = useCallback(async () => {
    if (addListInput?.current?.value) {
      await handleAddNewList(addListInput?.current?.value, handleConfirm);
    } else {
      handleConfirm();
    }
  }, [handleAddNewList, handleConfirm]);

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
            addListInput={addListInput}
            lists={lists}
            setLists={setLists}
            onAddList={handleAddNewList}
            savingList={savingList}
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
          {subtasksPresent && movingContentType === 'TASK' && (
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
              subtasksPresent && movingContentType === 'TASK'
                ? !selectedList || !selectedGroup || !selectedParentTask
                : !selectedList
            }
            onClick={handleConfirmWrapper}
          >
            {confirmText || 'Save'}
          </Button>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectDestinationModal;
