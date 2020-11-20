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
  FixedWidthButtonWrapper,
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
          <FixedWidthButtonWrapper width={100}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="outlined"
              type="button"
              onClick={onLogout}
            >
              Logout
            </Button>
          </FixedWidthButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={182}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
              onClick={closeModal}
            >
              Stay logged in
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default AutoLogoutModal;
