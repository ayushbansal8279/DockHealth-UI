import React from 'react';
import styled from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder.png';
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

const PrimaryText = styled.span`
  font-size: 18px;
  font-weight: 400;
`;

const MoveTasksWithSubtasksModal = ({ closeModal, confirm }) => {
  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <ModalHeaderName>
            All subtasks will move with main task
          </ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          Main tasks and sub tasks cannot be separated upon moving
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
              closeModal();
            }}
          >
            Move All
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default MoveTasksWithSubtasksModal;
