import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Button from 'components/common/Button/Button';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder.png';
import { getUserActiveTasksCount } from 'api/user-api';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
} from '../styled';
import { FirstDescription, SecondDescription } from './styled';

const RemoveActiveUserModal = ({ closeModal, confirm, userIdentifier }) => {
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    getUserActiveTasksCount(userIdentifier).then(({ data }) =>
      setTaskCount(data?.metricValue),
    );
  }, [userIdentifier]);

  return (
    <MuiThemeProvider theme={redTheme}>
      <ModalWrapper>
        <ModalIconContainer>
          <ModalMainIcon src={folderUser} alt="folder_user" />
          <Typography color="textPrimary" variant="h2">
            Remove as an active User
          </Typography>
        </ModalIconContainer>
        <ModalDescriptionContainer>
          <FirstDescription>
            {taskCount > 0
              ? `This user has ${taskCount} tasks assigned to them. These tasks will
            become unassigned and you can reassign in the list(s).`
              : `Are you sure you want to remove this user?`}
          </FirstDescription>
          <SecondDescription>
            If removed, you will not be charged for this user starting in the
            next billing cycle.
          </SecondDescription>
        </ModalDescriptionContainer>
        <ButtonsContainer>
          <FlexButtonWrapper>
            <Button
              fullWidth
              variant="secondary-red"
              size="small"
              onClick={closeModal}
            >
              Do not remove
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
              Remove
            </Button>
          </FlexButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
