import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getTaskListForUser } from 'actions/task-list-actions';
import { addTaskList } from 'api/task-list-api';
import Button from 'components/common/Button/Button';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import { Description, ListPickerModalWrapper, Title } from './styled';
import { ModalWrapperWithPadding, CloseIconButton, CloseIcon } from '../styled';
import ListSelectSection from './ListSelectSection';
import GroupPicker from '../common/GroupPicker/GroupPicker';

const STEPS = {
  1: 1,
  2: 2,
};

const ListPickerModal = ({
  closeModal,
  onCreateGroup,
  confirm,
  fetchMethod,
  listCreationPayload = {},
  enableSelectingGroupStep = false,
}) => {
  const [selectedList, setSelectedList] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [step, setStep] = useState(STEPS[1]);
  const [isSavingList, setSavingList] = useState(false);

  const dispatch = useDispatch();

  const handleSave = () => {
    if (enableSelectingGroupStep && step === STEPS[1]) {
      setStep(STEPS[2]);
      return;
    }
    confirm(selectedList.taskListIdentifier, selectedGroup.taskGroupIdentifier);
    closeModal();
  };

  const refreshListsInStore = () => {
    dispatch(getTaskListForUser());
  };

  const handleAddNewList = listName => {
    if (isSavingList) return;

    setSavingList(true);
    addTaskList({
      ...listCreationPayload,
      listName,
    })
      .then(list => {
        setSavingList(false);
        setLists(l => [list, ...l]);
        selectedList(list.taskListIdentifier);
        refreshListsInStore();
      })
      .catch(() => {
        setSavingList(false);
      });
  };

  useEffect(() => {
    fetchMethod()
      .then(data => {
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
        {step === STEPS[1] && (
          <ListSelectSection
            lists={lists}
            selectedList={selectedList}
            isFetchingLists={isFetchingLists}
            onListSelection={setSelectedList}
            onAddList={handleAddNewList}
          />
        )}
        {step === STEPS[2] && (
          <>
            <Title>Select group</Title>
            <Description>Choose a group for your task</Description>
            <Spacing vertical={4} />
            <GroupPicker
              selectedList={selectedList}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              onCreateGroup={onCreateGroup}
            />
          </>
        )}
        <Spacing vertical={4} />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={6}>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              size="small"
            >
              {step === STEPS[1] ? 'cancel' : 'back'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="button"
              onClick={handleSave}
              size="small"
              disabled={
                isSavingList ||
                !selectedList ||
                (step === STEPS[2] && !selectedGroup)
              }
            >
              Select
            </Button>
          </Grid>
        </Grid>
      </ListPickerModalWrapper>
    </ModalWrapperWithPadding>
  );
};

export default ListPickerModal;
