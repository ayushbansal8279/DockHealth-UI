import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
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
import { FirstDescription } from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const UnassignTaskTemplateModal = ({ closeModal, confirm, taskCount }) => {
  const taskPhrase = useMemo(() => {
    if (taskCount === 1) return '1 task';
    if (taskCount > 1) return `${taskCount} tasks`;
    return 'Some of the tasks';
  }, [taskCount]);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <ModalHeaderName>Task will be unassigned</ModalHeaderName>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <FirstDescription>
            {taskPhrase} are assigned to users not invited to this list. These
            tasks will become unassigned
          </FirstDescription>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Cancel
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              closeModal();
              confirm();
            }}
          >
            Unassign
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default UnassignTaskTemplateModal;
