import React from 'react';
import { Button, Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import TrashCan from 'img/modals/trash-can.svg';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
  DeleteButton,
  ModalHeaderName,
} from '../styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const DeleteFolder = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={TrashCan} alt="Task" />
          <ModalHeaderName>Delete Folder</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          Are you sure you want to delete this folder? This action cannot be
          undone.
        </ModalDescriptionContainer>
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
            Delete Permanently
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteFolder;
