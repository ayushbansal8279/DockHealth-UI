import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import Button from 'components/common/Button/Button';
import * as TaskApi from 'api/task-api';
import { string } from 'yup';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  ModalHeader,
  ModalDescription,
} from '../styled';
import { MessageTextarea } from './styled';
import AddExternalUser from './AddExternalUser/AddExternalUser';
import UsersSelect from './UsersSelect/UsersSelect';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ShareTaskModal = props => {
  const { closeModal, taskIdentifier } = props;
  const dispatch = useDispatch();
  const [externalUserInitialValues, setExternalUserInitialValues] = useState(
    null,
  );
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageValue, setMessageValue] = useState('');

  const addSelectedUser = user => {
    setSelectedUsers(u => [...u, user]);
  };

  const deleteSelectedUser = userId => {
    setSelectedUsers(previousSelectedUsers =>
      previousSelectedUsers.filter(se => se.identifier !== userId),
    );
  };

  const handleAddExternalUser = user => {
    addSelectedUser(user);
    setExternalUserInitialValues(null);
  };

  const handleMoveToExternalForm = userSearchText => {
    const text = userSearchText.trim();
    const formValues = {
      firstName: '',
      lastName: '',
      email: '',
    };
    if (
      string()
        .email()
        .isValidSync(text)
    ) {
      formValues.email = text;
    } else {
      const names = text.split(' ');
      formValues.firstName = names.slice(0, -1).join(' ');
      formValues.lastName = names.slice(-1).join(' ');
    }

    setExternalUserInitialValues(formValues);
  };

  const handleInvite = () => {
    const [usersIdentifier, externalUsers] = selectedUsers.reduce(
      (accumulator, selectedUser) => {
        if (selectedUser.identifier) {
          return [[...accumulator[0], selectedUser.identifier], accumulator[1]];
        }

        return [accumulator[0], [...accumulator[1], selectedUser]];
      },
      [[], []],
    );

    TaskApi.shareTask(
      taskIdentifier,
      usersIdentifier,
      externalUsers,
      messageValue,
    )
      .then(() => {
        dispatch(showGlobalAlert(AlertMessages.SHARED));
        closeModal();
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
  };

  return (
    <ModalWrapperWithPadding width="600px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Share tasks</ModalHeader>
      <ModalDescription>
        Copy here about what happens when you share the task
      </ModalDescription>
      <Box m={2} />
      {externalUserInitialValues ? (
        <AddExternalUser
          initialValues={externalUserInitialValues}
          selectedUsers={selectedUsers}
          onAdd={handleAddExternalUser}
          onCancel={() => setExternalUserInitialValues(null)}
        />
      ) : (
        <>
          <UsersSelect
            selectedUsers={selectedUsers}
            onAdd={addSelectedUser}
            onDelete={deleteSelectedUser}
            onMoveToExternalUserForm={handleMoveToExternalForm}
          />
          {selectedUsers?.length > 0 && (
            <MessageTextarea
              placeholder="Add a message to your invitation and copy instructions here"
              value={messageValue}
              onChange={event => setMessageValue(event?.target?.value || '')}
            />
          )}
          <Box display="flex" width="100%" justifyContent="flex-end" mt="16px">
            <Button
              type="button"
              width="auto"
              disabled={!selectedUsers || selectedUsers?.length === 0}
              onClick={handleInvite}
            >
              Invite
            </Button>
          </Box>
        </>
      )}
    </ModalWrapperWithPadding>
  );
};

export default ShareTaskModal;
