import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import TrashCan from 'img/modals/trash-can';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const DeleteListModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={TrashCan} alt="Task" />
        <Typography color="textPrimary" variant="h2">
          DELETE LIST
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this list? This action cannot be
          undone.
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Delete Permanently
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteListModal;
