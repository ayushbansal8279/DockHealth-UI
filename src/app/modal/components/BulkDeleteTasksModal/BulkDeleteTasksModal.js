import React from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import TrashCan from 'img/modals/trash-can';
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

const BulkDeleteTasksModal = ({
  closeModal,
  confirm,
  hasIncompleteParentTasks,
}) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={TrashCan} alt="Task" />
          <Typography color="textPrimary" variant="h2">
            DELETE TASKS
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            {hasIncompleteParentTasks
              ? 'You’re about to delete a primary tasks which have a subtasks that are not selected. Deleting the primary tasks will also delete all subtasks.'
              : 'Are you sure you want to delete these tasks? This action cannot be undone.'}
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
              Cancel
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={231}>
            <Button
              fullWidth
              color="red"
              size="small"
              variant="contained"
              type="button"
              onClick={() => {
                confirm();
                closeModal();
              }}
            >
              Delete Permanently
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default BulkDeleteTasksModal;
