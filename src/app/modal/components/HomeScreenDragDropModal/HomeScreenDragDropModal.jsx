import React from 'react';
import styled from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
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
import { CancelButton } from '../ModalButton/ModalButtons';

const PrimaryText = styled.span`
  font-size: 18px;
  font-weight: 400;
`;

const HomeScreenDragDropModal = ({ closeModal }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={SortArrows} alt="Sort arrows" />
          <ModalHeaderName>Drag and Drop to new group</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          You cannot move a task to a different group within the home screen{' '}
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Okay, Got It
          </CancelButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default HomeScreenDragDropModal;
