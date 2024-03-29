import React from 'react';
import Spacing from 'components/common/Spacing';
import TaskList from 'img/new-delete-icon.svg';
import { ConfirmButton, CancelButton } from '../ModalButton/ModalButtons';

import { ModalWrapper, ModalMainIcon, ButtonsContainer } from '../styled';

import { ModalDescriptionContainer, ModalIconContainer } from './styled';

const LeaveListModal = ({ closeModal, confirm }) => {
  return (
    <ModalWrapper>
      <ModalIconContainer>
        <ModalMainIcon src={TaskList} alt="Task" />
        <h4>Leave List</h4>
      </ModalIconContainer>
      <ModalDescriptionContainer>
        You’re about to leave this list and will need to be invited to rejoin.
      </ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton style={{ width: '180px' }} onClick={closeModal}>
          Cancel
        </CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
          Leave List
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default LeaveListModal;
