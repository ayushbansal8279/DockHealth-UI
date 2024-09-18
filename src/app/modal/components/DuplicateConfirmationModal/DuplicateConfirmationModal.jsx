import React from 'react';
import Spacing from 'components/common/Spacing';
import TrashCan from 'img/new-delete-icon.svg';
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

const DuplicateConfirmationModal = ({
  title,
  description,
  closeModal,
  confirm,
  confirmButtonText = 'Duplicate',
}) => {
  return (
    <ModalWrapper>
      <CloseIconContainer>
        <ModalCloseIcon onClick={closeModal} src={CloseIcon} alt="Close Icon" />
      </CloseIconContainer>
      <ModalIconContainer>
        <ModalMainIcon src={TrashCan} alt="Trash can" />
        {title}
      </ModalIconContainer>
      <ModalDescriptionContainer>{description}</ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton
          onClick={() => {
            confirm();
            closeModal();
          }}
        >
          {confirmButtonText}
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default DuplicateConfirmationModal;
