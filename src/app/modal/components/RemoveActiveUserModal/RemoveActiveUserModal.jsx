import React, { useState, useEffect } from 'react';
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
  ModalHeaderName,
} from '../styled';
import { FirstDescription, SecondDescription } from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

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
          <ModalHeaderName>Remove as an active user</ModalHeaderName>
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
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Do Not Remove
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '180px' }}
            onClick={() => {
              closeModal();
              confirm();
            }}
          >
            Remove
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
