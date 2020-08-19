import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import folderUser from 'img/modals/user-folder';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  ConfirmButtonWrapper,
  CancelButtonWrapper,
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
            Are you sure you want to remove this user? If removed, you will not
            be charged for this user starting in the next billing cycle.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButtonWrapper>
            <Button
              fullWidth
              variant="outlined"
              type="button"
              color="red"
              size="small"
              onClick={closeModal}
            >
              Do not remove
            </Button>
          </CancelButtonWrapper>
          <ConfirmButtonWrapper>
            <Button
              fullWidth
              variant="contained"
              type="button"
              size="small"
              color="red"
              onClick={() => {
                confirm();
                closeModal();
              }}
            >
              Remove
            </Button>
          </ConfirmButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
