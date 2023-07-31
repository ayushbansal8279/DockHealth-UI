/* eslint-disable sonarjs/cognitive-complexity */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import filter from 'ramda/src/filter';
import prop from 'ramda/src/prop';
import { Box, ListItemText, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as AlertActions from 'alert/actions';
import debounce from 'lodash.debounce';
import { getUsersByName } from 'api/user-api';
// import Autocomplete from 'components/common/Autocomplete/Autocomplete';
import {
  Autocomplete,
  SelectedUsersContainer,
  SelectedUserItem,
  SelectedUserText,
  ExternalUserLabel,
} from './styled';

const UsersSelect = (props) => {
  const { selectedUsers, onAdd, onDelete, onMoveToExternalUserForm } = props;

  const dispatch = useDispatch();
  const currentUser = useSelector(userProfileSelector);

  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoadingOptions, setLoadingOptions] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUsersWithDebounce = useCallback(
    debounce((searchValue) => {
      // TODO: change endpoint for the one with external users
      getUsersByName(searchValue)
        .then((users) => {
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

  const handleInputChange = (event) => {
    setInputValue(event?.target?.value || '');
  };

  const renderUserOptionAvatar = (user) => {
    if (isUserGroup(user)) {
      return <GroupAvatar group={user} size={38} />;
    }

    return <UserAvatar user={user} size={35} />;
  };

  return (
    <>
      <Autocomplete
        autoHighlight
        inputValue={inputValue}
        getOptionLabel={prop('userName')}
        renderOption={(props_, option) => (
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="left"
            {...props_}
          >
            {renderUserOptionAvatar(option)}&nbsp;&nbsp;
            <ListItemText>
              {option.userName}
              {/* TODO: use backend external flag */}
              {option.external && (
                <ExternalUserLabel> (External)</ExternalUserLabel>
              )}
            </ListItemText>
          </Box>
        )}
        filterOptions={filter(
          (option) =>
            option.identifier !== currentUser.identifier &&
            !selectedUsers.some(
              (su) =>
                su.identifier === option.identifier ||
                su.email === option.email,
            ),
        )}
        loading={isLoadingOptions}
        options={options}
        onInputChange={handleInputChange}
        onChange={(_, selectedOption) => {
          onAdd(selectedOption);
        }}
        renderInput={({ inputProps, InputProps: rootProps }) => (
          <div {...rootProps}>
            <input
              placeholder="Type the name of the person or group  to invite"
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  inputValue &&
                  !isLoadingOptions &&
                  options?.length === 0
                ) {
                  onMoveToExternalUserForm(inputValue);
                }
              }}
              {...inputProps}
            />
          </div>
        )}
        noOptionsText={
          inputValue ? (
            <AddRecordOption
              searchValue={inputValue}
              onClick={() => {
                onMoveToExternalUserForm(inputValue);
              }}
            />
          ) : (
            'Type to search...'
          )
        }
      />
      {selectedUsers.length > 0 && (
        <>
          <SelectedUsersContainer>
            {selectedUsers.map((u) => (
              <SelectedUserItem key={u.identifier}>
                {renderUserOptionAvatar(u)}
                <SelectedUserText>
                  {u.userName || `${u.firstName} ${u.lastName} (${u.email})`}
                  {/* TODO: use backend external flag */}
                  {u.external && (
                    <ExternalUserLabel> (External)</ExternalUserLabel>
                  )}
                </SelectedUserText>
                <OptionsMenu
                  customButtonComponent={IconButton}
                  options={[
                    {
                      name: 'Remove',
                      onClick: () => onDelete(u.identifier),
                    },
                  ]}
                >
                  <MoreVertIcon />
                </OptionsMenu>
              </SelectedUserItem>
            ))}
          </SelectedUsersContainer>
        </>
      )}
    </>
  );
};

export default UsersSelect;
