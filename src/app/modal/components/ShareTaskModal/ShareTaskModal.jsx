import React from 'react';
// import { InviteToListModalWrapper, Header, Title, Description } from './styled';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  ModalHeader,
  ModalDescription,
} from '../styled';

const ShareTaskModal = props => {
  const { closeModal, taskIdentifiers } = props;

  console.log('taskIdentifiers', taskIdentifiers);

  return (
    <ModalWrapperWithPadding width="600px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Share tasks</ModalHeader>
      <ModalDescription>
        Copy here about what happens when you share the task
      </ModalDescription>
    </ModalWrapperWithPadding>
  );
};

export default ShareTaskModal;
