import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
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
          <ModalHeaderName>Clear Filter, Search and Sort</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          This page has an active filter, search or sort applied. In order to
          enable drag and drop please clear any filters and sorting.
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '280px' }}
            onClick={() => {
              confirm();
              if (closeOnConfirm) closeModal();
            }}
          >
            Clear Filter / Sort / Search
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default ClearSortFiltersModal;
