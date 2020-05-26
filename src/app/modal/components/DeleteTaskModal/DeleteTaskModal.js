import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import File from 'img/modals/file';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
} from '../styled';

const DeleteTaskModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={File} alt="file" />
        <Typography color="textPrimary" variant="h2">
          Delete task
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          Are you sure you want to delete this task? If you delete this task and
          there are subtasks attached to the task, the subtasks will be deleted.
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <Button variant="outlined" type="button" onClick={closeModal}>
            No, do not delete
          </Button>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Yes
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default DeleteTaskModal;
