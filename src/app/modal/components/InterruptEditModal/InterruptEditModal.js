import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import DownArrow from 'img/modals/down-arrow';
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

const InterruptEditModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={DownArrow} alt="Task" />
          <Typography variant="body1">
            YOU HAVE UNSAVED CHANGES TO THE PATIENT’S PROFILE
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer />
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              DON’T SAVE
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={231}>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={confirm}
            >
              SAVE CHANGES
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default InterruptEditModal;
