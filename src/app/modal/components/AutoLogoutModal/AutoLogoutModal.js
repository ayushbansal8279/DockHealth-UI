import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import TimeoutIcon from 'img/modals/timeout';
import { redTheme } from '../../themes/red-theme';

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
          <Typography color="textSecondary" variant="h2">
            YOUR SESSION IS ABOUT TO TIME OUT
          </Typography>
        </ModalIconContainer>
        <Spacing vertical={4} />
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={onLogout}
            >
              Logout
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={closeModal}
            >
              Stay logged in
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AutoLogoutModal;
