import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import CircleCompletedGrey from 'img/circle-completed-grey';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const CompleteAllTasksModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={CircleCompletedGrey} alt="completed" />
        <Typography color="textSecondary" variant="h2">
          A SUBTASK IS INCOMPLETE
        </Typography>
        <Spacing vertical={5} />
        <Typography variant="body1">
          You’re about to complete a primary task which has a subtask that is
          incomplete. Marking the primary task as complete will also complete
          all subtasks
        </Typography>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            No, don&apos;t complete
          </CancelButton>
          <Spacing horizontal={3} />
          <ConfirmButton variant="contained" type="button" onClick={confirm}>
            Yes, complete all
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default CompleteAllTasksModal;
