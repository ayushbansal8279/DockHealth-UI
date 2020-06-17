import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import Comment from 'img/modals/comment';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const DeleteCommentModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={Comment} alt="Task" />
        <Typography color="textPrimary" variant="h2">
          DELETE COMMENT
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this comment? This action cannot be
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

export default DeleteCommentModal;
