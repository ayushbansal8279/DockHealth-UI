import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const RemoveActiveUserModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <Typography color="textPrimary" variant="h2">
            Remove as an active User
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Are you sure you want to remove this user as a paid, active user? If
            removed, you will not be charged for this user starting in the next
            billing cycle.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            No, do not remove
          </CancelButton>
          <Spacing horizontal={3} />
          <ConfirmButton
            variant="contained"
            type="button"
            onClick={() => {
              confirm();
              closeModal();
            }}
          >
            Remove
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
