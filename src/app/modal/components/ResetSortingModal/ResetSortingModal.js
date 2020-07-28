import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import SortArrows from 'img/modals/sort-arrows';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ButtonsContainer,
  ConfirmButton,
  CancelButton,
} from '../styled';

const ResetSortingModal = ({ closeModal, closeOnConfirm, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalMainIcon src={SortArrows} alt="Sort arrows" />
        <Typography color="textPrimary" variant="h2">
          RESET SORTING
        </Typography>
        <Spacing vertical={4} />
        <Typography variant="body1">
          In order to enable dragging tasks, please reset the sort.
        </Typography>
        <Spacing vertical={4} />
        <Spacing vertical={2} />
        <ButtonsContainer>
          <CancelButton variant="outlined" type="button" onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={3} />
          <ConfirmButton
            variant="contained"
            type="button"
            onClick={() => {
              confirm();
              if (closeOnConfirm) closeModal();
            }}
          >
            Reset
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ResetSortingModal;
