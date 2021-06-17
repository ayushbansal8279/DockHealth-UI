import React from 'react';
import { Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import SortArrows from 'img/modals/sort-arrows';
import { redTheme } from '../../themes/red-theme';

import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FixedWidthButtonWrapper,
} from '../styled';

const ClearSortFiltersModal = ({ closeModal, closeOnConfirm, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={SortArrows} alt="Sort arrows" />
          <Typography color="textSecondary" variant="h2">
            CLEAR SORT
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            This page has an active sort. In order to enable drag and drop we’ll
            need to clear the sort.
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FixedWidthButtonWrapper width={120}>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </FixedWidthButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={152}>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={() => {
                confirm();
                if (closeOnConfirm) closeModal();
              }}
            >
              CLEAR SORT
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ClearSortFiltersModal;
