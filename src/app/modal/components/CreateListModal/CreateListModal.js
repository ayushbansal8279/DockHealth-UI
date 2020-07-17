import React from 'react';
import { CreateListModalWrapper } from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const CreateListModal = ({ closeModal }) => {
  return (
    <CreateListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      CreateListModal
    </CreateListModalWrapper>
  );
};

export default CreateListModal;
