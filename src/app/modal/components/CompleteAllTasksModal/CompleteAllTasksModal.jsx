import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import CircleCompletedGrey from 'img/circle-completed-grey.svg';
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

const CompleteAllTasksModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={CircleCompletedGrey} alt="completed" />
          <ModalHeaderName>A Subtask Is Incomplete</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          You’re about to complete a primary task which has a subtask that is
          incomplete. Marking the primary task as complete will also complete
          all subtasks
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Do Not Complete
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton style={{ width: '180px' }} onClick={confirm}>
            Complete All
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default CompleteAllTasksModal;
