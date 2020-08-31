import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import ExitIcon from 'img/exit';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FixedWidthButtonWrapper,
} from '../styled';

const LeaveOrganizationModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={ExitIcon} alt="Task" />
          <Typography color="textSecondary" variant="h2">
            LEAVE ORGANIZATION
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            You’re about to leave this Organization and will need to be invited
            by a member to rejoin.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FixedWidthButtonWrapper width={120}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="outlined"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </FixedWidthButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={108}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
              onClick={confirm}
            >
              Leave
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default LeaveOrganizationModal;
