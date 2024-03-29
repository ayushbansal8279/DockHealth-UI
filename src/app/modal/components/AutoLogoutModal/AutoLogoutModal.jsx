import React from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import TimeoutIcon from 'img/modals/timeout.svg';
import { redTheme } from '../../themes/red-theme';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';

const AutoLogoutModal = ({ closeModal, onLogout }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={TimeoutIcon} alt="Task" />
          <h4 style={{ whiteSpace: 'nowrap' }}>
            Your session is About to Time Out
          </h4>
        </ModalIconContainer>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <FlexButtonWrapper>
            <CancelButton style={{ width: '180px' }} onClick={onLogout}>
              Logout
            </CancelButton>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <ConfirmButton style={{ width: '180px' }} onClick={closeModal}>
              Stay logged in
            </ConfirmButton>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AutoLogoutModal;
