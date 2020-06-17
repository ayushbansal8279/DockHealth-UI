import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Note from 'img/modals/note';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
} from '../styled';

const DeleteGroupModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={Note} alt="note" />
        <Typography color="textPrimary" variant="h2">
          Delete patient note
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this note? This action cannot be
          undone
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <Button variant="outlined" type="button" onClick={closeModal}>
            Cancel
          </Button>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Delete permanently
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteGroupModal;
