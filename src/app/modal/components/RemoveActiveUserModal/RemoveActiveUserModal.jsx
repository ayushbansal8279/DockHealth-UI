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
import SingleUserPicker from '@/app/components/user/SingleUserPicker/SingleUserPicker';
import { reassignTask } from '@/app/api/task-api';

const RemoveActiveUserModal = ({ closeModal, confirm, userIdentifier }) => {
  const [taskCount, setTaskCount] = useState(0);
  const [selectedUserIdentifier, setSelectedUserIdentifier] = useState(null);

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
              ? `This user has ${taskCount} tasks assigned to them. 
              Removing the user without reassigning their tasks will unassign those tasks`
              : `Are you sure you want to remove this user?`}
          </FirstDescription>
          <SecondDescription>
            {taskCount > 0 && (
              <>
                Select an alternative existing user to reassign the current
                pending tasks and workflows
              </>
            )}
          </SecondDescription>
        </ModalDescriptionContainer>
        {taskCount > 0 && (
          <div
            style={{
              marginTop: '16px',
              marginBottom: '16px',
              width: '100%',
              padding: '0 24px',
              boxSizing: 'border-box',
            }}
          >
            <SingleUserPicker
              value={selectedUserIdentifier}
              onChange={setSelectedUserIdentifier}
              placeholder="Search user to reassign tasks"
              removedUserIdentifier={userIdentifier}
            />
          </div>
        )}
        <ButtonsContainer>
          <CancelButton style={{ width: '180px' }} onClick={closeModal}>
            Do Not Remove
          </CancelButton>
          <Spacing horizontal={4} />
          <ConfirmButton
            style={{ width: '250px' }}
            onClick={async () => {
              closeModal();
              if (selectedUserIdentifier) {
                await reassignTask({
                  fromUserIdentifier: userIdentifier,
                  toUserIdentifier: selectedUserIdentifier,
                });
              }
              confirm();
            }}
          >
            Remove and {selectedUserIdentifier ? 'Assign' : 'Unassign'}
          </ConfirmButton>
        </ButtonsContainer>
      </ModalWrapper>
    </MuiThemeProvider>
  );
};

export default RemoveActiveUserModal;
