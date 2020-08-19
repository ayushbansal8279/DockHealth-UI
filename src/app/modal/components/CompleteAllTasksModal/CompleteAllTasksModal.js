import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import CircleCompletedGrey from 'img/circle-completed-grey';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
} from '../styled';

const CompleteAllTasksModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={CircleCompletedGrey} alt="completed" />
          <Typography color="textSecondary" variant="h2">
            A SUBTASK IS INCOMPLETE
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            You’re about to complete a primary task which has a subtask that is
            incomplete. Marking the primary task as complete will also complete
            all subtasks
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="outlined"
              type="button"
              onClick={closeModal}
            >
              Do not complete
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={172}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
              onClick={confirm}
            >
              Complete all
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default CompleteAllTasksModal;
