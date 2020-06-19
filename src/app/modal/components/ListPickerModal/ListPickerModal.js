import React, { useState, useEffect } from 'react';
import { CloseIconButton, CloseIcon } from './styled';
import { ModalWrapper } from '../styled';
import ListSelectSection from './ListSelectSection';
import ListAddSection from './ListAddSection';

const MODAL_MODE = {
  SELECT: 'select',
  CREATE: 'create',
};

const ListPickerModal = ({ closeModal, confirm, fetchMethod }) => {
  const [selectedList, setSelectedList] = useState(null);
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [lists, setLists] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [modalMode, setModalMode] = useState(MODAL_MODE.SELECT);

  const handleSave = taskListIdentifier => {
    confirm(taskListIdentifier);
    closeModal();
  };

  const handleNavigateToAddList = listName => {
    setNewListName(listName);
    setModalMode(MODAL_MODE.CREATE);
  };

  const handleNavigateToSelectList = () => {
    setNewListName('');
    setModalMode(MODAL_MODE.SELECT);
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
    <ModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      {modalMode === MODAL_MODE.SELECT ? (
        <ListSelectSection
          lists={lists}
          selectedList={selectedList}
          isFetchingLists={isFetchingLists}
          onListSelection={setSelectedList}
          onAddList={handleNavigateToAddList}
          onSave={handleSave}
          onCancel={closeModal}
        />
      ) : (
        <ListAddSection
          listName={newListName}
          onCancel={handleNavigateToSelectList}
        />
      )}
    </ModalWrapper>
  );
};

export default ListPickerModal;
