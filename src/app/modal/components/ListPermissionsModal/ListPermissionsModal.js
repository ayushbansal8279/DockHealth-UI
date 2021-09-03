import React, { useState } from 'react';
import { ListFormModalWrapper } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';
import ListDetailsForm from './ListPermissionsForm/ListPermissionsForm';

const ListFormModal = ({ closeModal, onListCreationSuccess, list = null }) => {
  const [editedList, setEditedList] = useState(list);

  return (
    <ListFormModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ListDetailsForm
        list={editedList}
        setList={setEditedList}
        closeModal={closeModal}
        onListCreationSuccess={onListCreationSuccess}
      />
    </ListFormModalWrapper>
  );
};

export default ListFormModal;
