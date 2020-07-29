import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTaskListForUser } from 'actions/tasklist-actions';
import { addTaskList } from 'api/tasklist-api';
import { ListPickerModalWrapper } from './styled';
import { ModalWrapperWithPadding, CloseIconButton, CloseIcon } from '../styled';
import ListSelectSection from './ListSelectSection';

const ListPickerModal = ({
  closeModal,
  confirm,
  fetchMethod,
  listCreationPayload = {},
}) => {
  const [selectedList, setSelectedList] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [isSavingList, setSavingList] = useState(false);

  const dispatch = useDispatch();

  const handleListSelectSave = taskListIdentifier => {
    if (isSavingList || !taskListIdentifier) {
      return;
    }
    confirm(taskListIdentifier);
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
      .then(({ taskListIdentifier }) => {
        setSavingList(false);
        handleListSelectSave(taskListIdentifier);
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

  return (
    <ModalWrapperWithPadding>
      <ListPickerModalWrapper>
        <CloseIconButton onClick={closeModal} size="small" color="secondary">
          <CloseIcon />
        </CloseIconButton>
        <ListSelectSection
          lists={lists}
          selectedList={selectedList}
          isFetchingLists={isFetchingLists}
          onListSelection={setSelectedList}
          onSave={handleListSelectSave}
          onAddList={handleAddNewList}
          onCancel={closeModal}
        />
      </ListPickerModalWrapper>
    </ModalWrapperWithPadding>
  );
};

export default ListPickerModal;
