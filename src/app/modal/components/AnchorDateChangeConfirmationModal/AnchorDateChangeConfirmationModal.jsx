import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import Note from 'img/modals/note.svg';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const AnchorDateChangeConfirmationModal = ({
  closeModal,
  confirm,
  confirmButtonText = 'Proceed',
}) => {
  const title = `Date changes will impact workflow task due dates`;
  const description = `Would you like to update any dependent tasks with the date changes?`;

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={Note} alt="note" />
          <ModalHeaderName>{title}</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>{description}</ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            {confirmButtonText}
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AnchorDateChangeConfirmationModal;
