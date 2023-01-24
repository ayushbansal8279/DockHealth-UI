import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';
import { FirstDescription } from './styled';

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
          <Typography color="textPrimary" variant="h2">
            Task will be unassigned
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <FirstDescription>
            {taskPhrase} are assigned to users not invited to this list. These
            tasks will become unassigned
          </FirstDescription>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="primary-red"
              size="small"
              onClick={() => {
                closeModal();
                confirm();
              }}
            >
              Unassign
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default UnassignTaskTemplateModal;
