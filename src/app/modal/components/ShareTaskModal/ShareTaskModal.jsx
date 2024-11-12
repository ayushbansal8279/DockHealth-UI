import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as TaskActions from 'actions/task-actions';
import { string } from 'yup';
import Spacing from 'components/common/Spacing';
import Checkbox from 'components/common/Checkbox/Checkbox';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  ModalHeader,
  ModalDescription,
  CheckboxContainer,
  CheckboxDescription,
} from '../styled';
// import { MessageTextarea } from './styled';
import AddExternalUser from './AddExternalUser/AddExternalUser';
import UsersSelect from './UsersSelect/UsersSelect';
import { ConfirmButton } from '../ModalButton/ModalButtons';

const ShareTaskModal = (props) => {
  const { taskIdentifier, closeModal } = props;
  const dispatch = useDispatch();
  const [externalUserInitialValues, setExternalUserInitialValues] =
    useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageValue, setMessageValue] = useState('');
  const [assignTask, setAssignTask] = useState(false);

  const addSelectedUser = (user) => {
    setSelectedUsers((u) => [...u, user]);
  };

  const deleteSelectedUser = (userId) => {
    setSelectedUsers((previousSelectedUsers) =>
      previousSelectedUsers.filter((se) => se.identifier !== userId),
    );
  };

  const handleAddExternalUser = (user) => {
    // TODO: use backend external flag
    addSelectedUser({ ...user, external: true });
    setExternalUserInitialValues(null);
  };

  const handleMoveToExternalForm = (userSearchText) => {
    const text = userSearchText.trim();
    const formValues = {
      firstName: '',
      lastName: '',
      email: '',
    };
    if (string().email().isValidSync(text)) {
      formValues.email = text;
    } else {
      const names = text.split(' ');
      formValues.firstName = names.slice(0, -1).join(' ');
      formValues.lastName = names.slice(-1).join(' ');
    }

    setExternalUserInitialValues(formValues);
  };

  const handleInvite = () => {
    const [userIdentifiers, externalUsers] = selectedUsers.reduce(
      (accumulator, selectedUser) => {
        if (selectedUser.identifier) {
          return [[...accumulator[0], selectedUser.identifier], accumulator[1]];
        }

        return [accumulator[0], [...accumulator[1], selectedUser]];
      },
      [[], []],
    );

    dispatch(
      TaskActions.shareTask(
        taskIdentifier,
        userIdentifiers,
        externalUsers,
        messageValue,
        assignTask,
      ),
    );
  };

  return (
    <ModalWrapperWithPadding width="600px">
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <ModalHeader>Share tasks</ModalHeader>
      <ModalDescription>
        {externalUserInitialValues
          ? 'Enter the details of the outside collaborator'
          : 'Share this task with another user from your organization'}
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
          {/* {selectedUsers?.length > 0 && (
            <MessageTextarea
              placeholder="Add a message to your invitation and copy instructions here"
              value={messageValue}
              onChange={(event) => setMessageValue(event?.target?.value || '')}
            />
          )} */}
          <Box
            display="flex"
            width="100%"
            justifyContent="flex-start"
            mt="16px"
          >
            <CheckboxContainer>
              <Checkbox
                size={16}
                onClick={() => setAssignTask(!assignTask)}
                isChecked={assignTask}
              />
              <Spacing horizontal={3} />
              <CheckboxDescription>Assign Task</CheckboxDescription>
            </CheckboxContainer>
          </Box>
          <Box display="flex" width="100%" justifyContent="flex-end" mt="16px">
            <ConfirmButton
              style={{width: 'auto'}}
              disabled={!selectedUsers || selectedUsers?.length === 0}
              onClick={handleInvite}
            >
              Share
            </ConfirmButton>
          </Box>
        </>
      )}
    </ModalWrapperWithPadding>
  );
};

export default ShareTaskModal;
