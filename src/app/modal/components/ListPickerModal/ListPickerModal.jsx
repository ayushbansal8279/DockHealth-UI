import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getTaskListForUser } from 'actions/task-list-actions';
import { addTaskList } from 'api/task-list-api';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import { ListPickerModalWrapper } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  StepsContainer,
  Container,
} from '../styled';
import GroupSelectSection from './GroupSelectSection';
import ListSelectStep from './ListSelectStep';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const STEPS = {
  1: 0,
  2: 1,
};

const ListPickerModal = ({
  closeModal,
  onCreateGroup,
  confirm,
  fetchMethod,
  listCreationPayload = {},
  enableSelectingGroupStep = false,
  renderDescription
}) => {
  const [selectedList, setSelectedList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [step, setStep] = useState(STEPS[1]);
  const [isSavingList, setSavingList] = useState(false);

  const dispatch = useDispatch();
  const addListInput = useRef(null);

  const handleSave = () => {
    confirm(
      selectedList.taskListIdentifier,
      selectedGroup?.taskGroupIdentifier,
    );
    closeModal();
  };

  const refreshListsInStore = () => {
    dispatch(getTaskListForUser());
  };

  const handleAddNewList = (listName) => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      ...listCreationPayload,
      listName,
    })
      .then((list) => {
        setSavingList(false);
        setLists((l) => [list, ...l]);
        selectedList(list.taskListIdentifier);
        refreshListsInStore();
      })
      .catch(() => {
        setSavingList(false);
      });
  };

  useEffect(() => {
    fetchMethod()
      .then((data) => {
        setLists(data);
        setIsFetchingLists(false);
      })
      .catch(() => {
        closeModal();
      });
  }, [closeModal, fetchMethod]);

  const handleCancel = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    step === STEPS[1] ? closeModal() : setStep(STEPS[1]);
  }, [closeModal, step]);

  return (
    <ModalWrapperWithPadding>
      <ListPickerModalWrapper>
        <CloseIconButton onClick={closeModal} size="small" color="secondary">
          <CloseIcon />
        </CloseIconButton>
        <Container>
          <StepsContainer stepIndex={step}>
            <ListSelectStep
              enableSelectingGroupStep={enableSelectingGroupStep}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              setNextStep={() => setStep(STEPS[2])}
              closeModal={closeModal}
              addListInput={addListInput}
              lists={lists}
              setLists={setLists}
              onAddList={handleAddNewList}
              savingList={isFetchingLists}
              renderDescription={renderDescription}
            />
            {enableSelectingGroupStep && (
              <GroupSelectSection
                onCreateGroup={onCreateGroup}
                selectedList={selectedList}
                setSelectedList={setSelectedList}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                setPreviousStep={() => setStep(STEPS[1])}
                setNextStep={() => setStep(STEPS[2])}
              />
            )}
          </StepsContainer>
        </Container>
        <Spacing vertical={4} />
        <Grid container direction="row" spacing={2}>
          <Grid item size={6}>
            <CancelButton onClick={handleCancel}>
              {step === STEPS[1] ? 'Cancel' : 'Back'}
            </CancelButton>
          </Grid>
          <Grid item size={6}>
            <ConfirmButton
              disabled={isSavingList || isFetchingLists || !selectedList}
              onClick={handleSave}
            >
              Select
            </ConfirmButton>
          </Grid>
        </Grid>
      </ListPickerModalWrapper>
    </ModalWrapperWithPadding>
  );
};

export default ListPickerModal;
