import React from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import DeleteIcon from '@mui/icons-material/Delete';
import spacing from 'styles/spacing';
import {
  ModalWrapper,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  ModalHeaderName,
} from './styled';
import { CancelButton, ConfirmButton } from './ModalButton/ModalButtons';

interface Props {
  closeModal: VoidFunction;
  confirm: VoidFunction;
}

export default function DeleteOrganizationModal({
  closeModal,
  confirm,
}: Props) {
  return (
    <ModalWrapper>
      <ModalIconContainer>
        <DeleteIcon fontSize="large" color="error" sx={{ mb: spacing.large }} />
        <ModalHeaderName>Delete Organization</ModalHeaderName>
      </ModalIconContainer>
      <ModalDescriptionContainer>
        You’re about to delete this Organization and will lose all data related
        to this Organization.
      </ModalDescriptionContainer>
      <ButtonsContainer>
        <CancelButton style={{ width: '180px' }} onClick={closeModal}>
          Cancel
        </CancelButton>
        <Spacing horizontal={4} />
        <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
          Delete
        </ConfirmButton>
      </ButtonsContainer>
    </ModalWrapper>
  );
}
