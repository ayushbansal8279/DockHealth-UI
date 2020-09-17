import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import Button from 'components/common/Button/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Spacing from 'components/common/Spacing';
import folderUser from 'img/modals/user-folder';
import { getUserActiveTasksCount } from 'api/user-api';
import { redTheme } from '../../themes/red-theme';
import {
  ModalWrapper,
  ModalMainIcon,
  ModalIconContainer,
  ModalDescriptionContainer,
  ButtonsContainer,
  FlexButtonWrapper,
  FixedWidthButtonWrapper,
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
            This user has tasks assigned {taskCount} to them. These tasks will
            become unassigned.
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
              variant="outlined"
              type="button"
              color="red"
              size="small"
              onClick={closeModal}
            >
              Do not remove
            </Button>
          </FlexButtonWrapper>
          <Spacing horizontal={4} />
          <FixedWidthButtonWrapper width={124}>
            <Button
              fullWidth
              variant="contained"
              type="button"
              size="small"
              color="red"
              onClick={() => {
                closeModal();
                confirm();
              }}
            >
              Remove
            </Button>
          </FixedWidthButtonWrapper>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
