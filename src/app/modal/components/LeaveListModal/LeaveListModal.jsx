import React from 'react';
import Spacing from 'components/common/Spacing';
import LeaveList from 'img/new-leave-list-icon.svg';
import { ConfirmButton, CancelButton } from '../ModalButton/ModalButtons';

import { ModalWrapper, ModalMainIcon, ButtonsContainer } from '../styled';

import {
  ModalDescriptionContainer,
  ModalHeaderName,
  ModalIconContainer,
} from './styled';

const LeaveListModal = ({ closeModal, confirm }) => {
  return (
    <ModalWrapper>
      <ModalIconContainer>
        <ModalMainIcon src={LeaveList} alt="Task" />
        <ModalHeaderName>Leave List</ModalHeaderName>
      </ModalIconContainer>
      <ModalDescriptionContainer>
        If you leave this list, you’ll need to be invited to rejoin
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
