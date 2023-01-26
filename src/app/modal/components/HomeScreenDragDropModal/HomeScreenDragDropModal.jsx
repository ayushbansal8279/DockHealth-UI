import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
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
} from '../styled';

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
          <Typography color="textSeconday" variant="h2" align="center">
            <PrimaryText>Drag and Drop to new group</PrimaryText>
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <Typography variant="body1">
            You cannot move a task to a different group within the home screen{' '}
          </Typography>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              type="button"
              size="small"
              onClick={closeModal}
            >
              OKAY, GOT IT
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default HomeScreenDragDropModal;
