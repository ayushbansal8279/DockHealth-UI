import React from 'react';
import Spacing from 'components/common/Spacing';
import CalendarIcon from '@/app/img/bulk-edit/CalendarIcon';

import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ModalHeaderName,
} from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const DateWarningModal = ({ closeModal, type, onSave }) => {
  const dueDateLabel = 'Selected Due Date is before Start Date';
  const startDateLabel = 'Selected Start Date is after Due Date';
  const label = type === 'dueDate' ? dueDateLabel : startDateLabel;

  const handleSave = () => {
    onSave();
    closeModal();
  };

  return (
    <ModalWrapper>
      <ModalIconContainer>
        <CalendarIcon width={40} height={40} />
      </ModalIconContainer>
      <ModalHeaderName>{label}</ModalHeaderName>
      <ModalDescriptionContainer>
        Would you like to save this date ?
      </ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <ConfirmButton onClick={handleSave}>Save</ConfirmButton>
        <Spacing horizontal={4} />
      </ButtonsContainer>
    </ModalWrapper>
  );
};

export default DateWarningModal;
