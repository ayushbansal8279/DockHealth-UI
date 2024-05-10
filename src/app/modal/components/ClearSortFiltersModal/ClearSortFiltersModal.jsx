import React from 'react';
import { Typography } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import SortArrows from 'img/modals/sort-arrows.svg';
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

const ClearSortFiltersModal = ({ closeModal, closeOnConfirm, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={SortArrows} alt="Sort arrows" />
          <ModalHeaderName>Clear Sort</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          This page has an active sort. In order to enable drag and drop we’ll
          need to clear the sort.
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              confirm();
              if (closeOnConfirm) closeModal();
            }}
          >
            Clear Sort
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ClearSortFiltersModal;
