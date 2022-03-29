import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as AlertActions from 'alert/actions';
import { Autocomplete } from '@material-ui/lab';
import debounce from 'lodash.debounce';
import { userProfileSelector } from 'selectors/user-selectors';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import Button from 'components/common/Button/Button';
import { getUsersByName } from 'api/user-api';
import { filter, prop } from 'ramda';
import { Box, IconButton, ListItemText } from '@material-ui/core';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  ModalWrapperWithPadding,
  CloseIconButton,
  CloseIcon,
  ModalHeader,
  ModalDescription,
} from '../styled';
import {
  useAutocompleteStyles,
  SelectedUsersContainer,
  SelectedUserItem,
  SelectedUserText,
  ExternalUserLabel,
  MessageTextarea,
} from './styled';
import AddExternalUser from './AddExternalUser/AddExternalUser';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ShareTaskModal = props => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);
  const { closeModal, taskIdentifiers } = props;
  const [isAddingExternalUser, setAddingExternalUser] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setLoadingOptions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [messageValue, setMessageValue] = useState('');

  console.log('taskIdentifiers', taskIdentifiers);

  const getUsersWithDebounce = useCallback(
    debounce(searchValue => {
      // TODO: change endpoint for the one with external users
      getUsersByName(searchValue)
        .then(users => {
          setOptions(users);
          setLoadingOptions(false);
        })
        .catch(() => {
          setLoadingOptions(false);
          dispatch(AlertActions.showGlobalErrorAlert());
        });
    }, 300),
    [getUsersByName, setOptions],
  );

  useEffect(() => {
    if (inputValue) {
      setLoadingOptions(true);
      getUsersWithDebounce(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, getUsersWithDebounce, setOptions]);

  const handleInputChange = event => {
    setInputValue(event?.target?.value || '');
  };

  const classes = useAutocompleteStyles();

  const renderUserOptionAvatar = user => {
    if (isUserGroup(user)) {
      return <GroupAvatar group={user} size={38} />;
    }

    return <UserAvatar user={user} size={38} />;
  };

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
    setAddingExternalUser(false);
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
      {isAddingExternalUser ? (
        <AddExternalUser
          selectedUsers={selectedUsers}
          onAdd={handleAddExternalUser}
          onCancel={() => setAddingExternalUser(false)}
        />
      ) : (
        <>
          <Autocomplete
            autoHighlight
            inputValue={inputValue}
            getOptionLabel={prop('userName')}
            renderOption={option => (
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ListItemText>
                  {option.userName}
                  {option.external && (
                    <ExternalUserLabel> (External)</ExternalUserLabel>
                  )}
                </ListItemText>
                {renderUserOptionAvatar(option)}
              </Box>
            )}
            filterOptions={filter(
              option =>
                option.identifier !== currentUser.identifier &&
                !selectedUsers.find(
                  su =>
                    su.identifier === option.identifier ||
                    su.email === option.email,
                ),
            )}
            loading={isLoadingOptions}
            options={options}
            classes={classes}
            onInputChange={handleInputChange}
            onChange={(_, selectedOption) => {
              addSelectedUser(selectedOption);
              // setOptions([]);
            }}
            renderInput={({ inputProps, InputProps: rootProps }) => (
              <div {...rootProps}>
                <input
                  placeholder="Type the name of the person or group  to invite"
                  {...inputProps}
                />
              </div>
            )}
            noOptionsText={
              inputValue ? (
                <AddRecordOption
                  searchValue={inputValue}
                  onClick={() => setAddingExternalUser(true)}
                />
              ) : (
                'Type to search...'
              )
            }
          />
          {selectedUsers.length > 0 && (
            <>
              <SelectedUsersContainer>
                {selectedUsers.map(u => (
                  <SelectedUserItem key={u.identifier}>
                    {renderUserOptionAvatar(u)}
                    <SelectedUserText>
                      {u.userName ||
                        `${u.firstName} ${u.lastName} (${u.email})`}
                      {(u.external || !u.identifier) && (
                        <ExternalUserLabel> (External)</ExternalUserLabel>
                      )}
                    </SelectedUserText>
                    <OptionsMenu
                      customButtonComponent={IconButton}
                      options={[
                        {
                          name: 'Remove',
                          onClick: () => deleteSelectedUser(u.identifier),
                        },
                      ]}
                    >
                      <MoreVertIcon />
                    </OptionsMenu>
                  </SelectedUserItem>
                ))}
              </SelectedUsersContainer>
              <MessageTextarea
                placeholder="Add a message to your invitation and copy instructions here"
                value={messageValue}
                onChange={event => setMessageValue(event?.target?.value || '')}
              />
            </>
          )}
          <Box display="flex" width="100%" justifyContent="flex-end" mt="16px">
            <Button
              type="button"
              width="auto"
              disabled={!selectedUsers || selectedUsers?.length === 0}
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
