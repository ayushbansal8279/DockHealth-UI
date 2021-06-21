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

const BulkCompleteTasksModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={CircleCompletedGrey} alt="completed" />
          <Typography color="textSecondary" variant="h2">
            SUBTASKS MAY BE INCOMPLETE
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            Marking this task as complete will also complete related subtasks.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Do not complete
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={172}>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={() => {
                confirm();
                closeModal();
              }}
            >
              Complete all
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default BulkCompleteTasksModal;
