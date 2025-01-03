import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import Attachment from 'img/modals/attachment.svg';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const AttachmentsDuplicateModal = ({ skip, confirm, closeModal }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={Attachment} alt="Attachment" />
          <ModalHeaderName>Duplicate Attachments</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          Would you like to duplicate attachments?
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton
            style={{ width: '180px' }}
            onClick={() => {
              skip();
              closeModal();
            }}
          >
            Do Not Duplicate
          </CancelButton>
          <Spacing horizontal={4} />

          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            Yes
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AttachmentsDuplicateModal;
