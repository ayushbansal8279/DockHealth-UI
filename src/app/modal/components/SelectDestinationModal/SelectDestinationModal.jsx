import React, { useState, useCallback, useRef } from 'react';
import { Box, Grid } from '@mui/material';
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
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const SelectDestinationModal = ({
  closeModal,
  confirm,
  confirmText,
  preventClosingModal = false,
  selectParentTask,
  openedWorkflowTab = false
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
        .then((createdList) => {
          setSavingList(false);
          setSelectedList(createdList);
          setLists((previousLists) =>
            setLists([...previousLists, createdList]),
          );
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
    (createdList) => {
      const taskList = createdList || selectedList;

      if (!taskList) return;

      const responseData = {
        taskListIdentifier: taskList?.taskListIdentifier,
        listName: taskList?.listName,
      };

      if (selectedGroup) {
        responseData.taskGroupIdentifier = selectedGroup.taskGroupIdentifier;
        responseData.groupName = selectedGroup.groupName;
      }

      if (selectedParentTask) {
        responseData.parentTaskIdentifier = selectedParentTask.taskIdentifier;
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
    setStepIndex((previousStepIndex) => previousStepIndex + 1);
  }, []);

  const handlePreviousStep = useCallback(() => {
    setStepIndex((previousStepIndex) => previousStepIndex - 1);
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
            openedWorkflowTab={openedWorkflowTab}
          />
          <GroupSelectStep
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            setPreviousStep={handlePreviousStep}
            selectParentTask={selectParentTask}
            setNextStep={handleNextStep}
          />
          {selectParentTask && (
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
          <CancelButton
            style={{ width: '190px' }}
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
            disabled={
              selectParentTask
                ? !selectedList || !selectedGroup || !selectedParentTask
                : !selectedList
            }
            onClick={handleConfirmWrapper}
            size="small"
          >
            {confirmText || 'Save'}
          </ConfirmButton>
        </FlexButtonWrapper>
      </Grid>
    </ModalWrapperWithPadding>
  );
};

export default SelectDestinationModal;
