import React from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder.png';
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

const ArchiveUserModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <ModalHeaderName>Archive User</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          Are you sure you want to archive this user? This action cannot be
          undone.
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Do Not Archive
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            Archive
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ArchiveUserModal;
