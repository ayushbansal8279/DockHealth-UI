import React from 'react';
import Spacing from 'components/common/Spacing';
import TimeIcon from 'img/time.svg';
import CloseIcon from 'img/Modal-Close-Icon.svg';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  CancelButton,
  ConfirmButton,
  ModalCloseIcon,
  CloseIconContainer,
} from '../DeleteConfirmationModal/styled';

const ClearDueDateConfirmationModal = ({ closeModal, confirm }) => {
  return (
    <ModalWrapper>
      <CloseIconContainer>
        <ModalCloseIcon onClick={closeModal} src={CloseIcon} alt="Close Icon" />
      </CloseIconContainer>
      <ModalIconContainer>
        <ModalMainIcon src={TimeIcon} alt="Time" />
        Clear Due Date
      </ModalIconContainer>
      <ModalDescriptionContainer>
        Are you sure you want to clear Due Date?
      </ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton
          style={{ height: '45px' }}
          onClick={() => {
            confirm();
            closeModal();
          }}
        >
          Clear Date
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default ClearDueDateConfirmationModal;
