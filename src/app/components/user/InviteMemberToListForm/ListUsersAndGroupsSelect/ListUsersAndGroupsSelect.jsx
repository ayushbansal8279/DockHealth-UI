import React, { useState, useRef, useMemo, useEffect } from 'react';
import Button from 'components/common/Button/Button';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import {
  ClickAwayListener,
  Grid,
} from '@mui/material';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { TextField } from '@mui/material';
import {
  Wrapper,
  // Placeholder,
  // SelectElement,
  // ButtonWrapper,
  // ItemWrapper,
  // ItemName,
  // RemoveItemButton,
  // RemoveItemIcon,
  // SearchInput,
  // AvailablePeopleWrapper,
  // AvailablePeopleItemButton,
  // UserName,
  // UserNameText,
  // SelectElementWrapper,
  EmptyPeopleResult,
  SearchedUserContainer,
  NameContainer,
  AvatarContainer,
} from './styled';
import SearchIcon from '@/app/img/navigation/SearchIcon';
import { event } from 'react-ga';

const ListUsersAndGroupsSelect = ({
  disabled,
  usersAndGroups,
  isLoadingAvailablePeople,
  onActionButtonClick,
  emptyListAction,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  // const searchInputReference = useRef(null);
  // const searchedUsersAndGroupsReferences = useRef([]);
  // const [hoveredItemIndex, setHoveredItemIndex] = useState(0);
  const [selectedUsersAndGroups, setSelectedUsersAndGroups] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState('');

  // const searchedAvailableUsersAndGroups = useMemo(
  //   () =>
  //     usersAndGroups.filter(({ name, email, identifier }) => {
  //       const searchValue = searchInputValue.toLowerCase();
  //       return (
  //         (name?.toLowerCase().includes(searchValue) ||
  //           email?.toLowerCase().startsWith(searchValue)) &&
  //         !selectedUsersAndGroups.some(
  //           (selectedUserAndGroup) =>
  //             selectedUserAndGroup.identifier === identifier,
  //         )
  //       );
  //     }),
  //   [searchInputValue, usersAndGroups, selectedUsersAndGroups],
  // );

  // const showMainInviteButton =
  //   !searchInputValue || searchedAvailableUsersAndGroups.length > 0;

  // const removeSelectedUserOrGroup = (identifier) => {
  //   setSelectedUsersAndGroups((currentSelectedUsersAndGroups) =>
  //     currentSelectedUsersAndGroups.filter(
  //       (userOrGroup) => userOrGroup.identifier !== identifier,
  //     ),
  //   );
  // };

  // const handleSelectUserOrGroup = (selectedUser) => {
  //   setSelectedUsersAndGroups((perviousSelectedUserAndGroup) => [
  //     ...perviousSelectedUserAndGroup,
  //     userOrGroup,
  //   ]);
  //   setSearchInputValue('');
  //   searchInputReference.current.focus();
  // };

  const handleInviteSelectedUsersAndGroups = (selectedUser) => {
    const selectedUsers = [selectedUser];
    if (selectedUsers?.length > 0) {
      onActionButtonClick(
        selectedUsers.map((s) => ({
          ...s,
          userIdentifier: s.identifier,
        })),
      );
      setSearchInputValue('');
    }
  };

  const handleEmptyResultActionClick = () => {
    emptyListAction(searchInputValue);
    setSearchInputValue('');
    // searchInputReference.current.blur();
  };

  // const handleSearchInputKeyDown = (event) => {
  //   switch (event.keyCode) {
  //     // esc key
  //     case 27:
  //       event.preventDefault();
  //       event.stopPropagation();
  //       searchInputReference.current.blur();
  //       setSearchInputValue('');
  //       break;

  //     // enter key
  //     case 13:
  //       event.preventDefault();
  //       event.stopPropagation();
  //       if (
  //         searchInputReference.current?.value &&
  //         searchedAvailableUsersAndGroups?.length > 0
  //       ) {
  //         handleSelectUserOrGroup(
  //           searchedAvailableUsersAndGroups[hoveredItemIndex],
  //         );
  //         break;
  //       }

  //       if (
  //         searchInputReference.current?.value &&
  //         searchedAvailableUsersAndGroups?.length === 0
  //       ) {
  //         handleEmptyResultActionClick();
  //         break;
  //       }

  //       if (selectedUsersAndGroups?.length > 0) {
  //         handleInviteSelectedUsersAndGroups();
  //         break;
  //       }

  //       break;

  //     // down arrow key
  //     case 40:
  //       event.preventDefault();
  //       event.stopPropagation();

  //       if (searchedAvailableUsersAndGroups?.length > 0) {
  //         setHoveredItemIndex((previousIndex) => {
  //           let newIndex;
  //           if (previousIndex === searchedAvailableUsersAndGroups.length - 1) {
  //             newIndex = 0;
  //           } else {
  //             newIndex = previousIndex + 1;
  //           }

  //           searchedUsersAndGroupsReferences.current[newIndex].scrollIntoView(
  //             false,
  //           );
  //           return newIndex;
  //         });
  //       }

  //       break;

  //     // up arrow key
  //     case 38:
  //       event.preventDefault();
  //       event.stopPropagation();

  //       if (searchedAvailableUsersAndGroups?.length > 0) {
  //         setHoveredItemIndex((previousIndex) => {
  //           let newIndex;
  //           if (previousIndex === 0) {
  //             newIndex = searchedAvailableUsersAndGroups.length - 1;
  //           } else {
  //             newIndex = previousIndex - 1;
  //           }

  //           searchedUsersAndGroupsReferences.current[newIndex].scrollIntoView(
  //             true,
  //           );
  //           return newIndex;
  //         });
  //       }

  //       break;

  //     default:
  //       // set content width plus input padding value
  //       searchInputReference.current.style.width =
  //         searchInputReference.current?.scrollWidth + 8;
  //       searchInputReference.current.scrollIntoView(true);
  //       break;
  //   }

  //   if (!searchInputReference.current?.value) {
  //     searchInputReference.current.style.width = 20;
  //   }
  // };

  // const handleSelectAreaClick = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   if (searchInputReference?.current) {
  //     searchInputReference.current.focus();
  //   }
  // };

  const handleSearch = () => {
    const searchedUsers = usersAndGroups.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchInputValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchInputValue.toLowerCase()),
    );
    setSelectedUsersAndGroups(searchedUsers);
  };

  useEffect(() => {
    handleSearch();
  }, [searchInputValue]);

  const sx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        borderWidth: '1px',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'grey',
    },
  }
  const inputStyle = {
    style: {
      textTransform: 'none',
    },
  };

  return (
    <Wrapper>
      <TextField
        variant="outlined"
        label="Add User or Group"
        value={searchInputValue}
        InputLabelProps={inputStyle}
        sx={sx}
        onChange={(event) => setSearchInputValue(event.target.value)}
      />
      {searchInputValue !== '' && (
        <SearchedUserContainer>
          {selectedUsersAndGroups?.map((user) => (
            <div style={{ display: 'flex' }}>
              <AvatarContainer>
                {isUserGroup(user) ? (
                  <GroupAvatar size={35} group={user} />
                ) : (
                  <UserAvatar size={35} user={user} />
                )}
              </AvatarContainer>
              <NameContainer
                disabled={selectedUsersAndGroups.length === 0 || disabled}
                onClick={() => handleInviteSelectedUsersAndGroups(user)}
              >
                {user.name}
              </NameContainer>
            </div>
          ))}
          {selectedUsersAndGroups?.length === 0 && searchInputValue !== '' && (
            <EmptyPeopleResult>
              <AddRecordOption
                searchValue={searchInputValue}
                onClick={handleEmptyResultActionClick}
              />
            </EmptyPeopleResult>
          )}
        </SearchedUserContainer>
      )}

      {/* <ClickAwayListener onClickAway={() => setSearchInputValue('')}>
        <SelectElementWrapper
          withValue={searchInputValue}
          fullWidth={!showMainInviteButton}
        >
          <SelectElement type="button" onClick={handleSelectAreaClick}>
            <>
              {selectedUsersAndGroups.map((user) => {
                return (
                  <ItemWrapper key={user.identifier}>
                    <ItemName>{user.name}</ItemName>
                    <RemoveItemButton
                      type="button"
                      onClick={() => removeSelectedUserOrGroup(user.identifier)}
                    >
                      <RemoveItemIcon />
                    </RemoveItemButton>
                  </ItemWrapper>
                );
              })}
              <SearchInput
                ref={searchInputReference}
                onKeyDown={handleSearchInputKeyDown}
                value={searchInputValue}
                onChange={(event) => setSearchInputValue(event.target.value)}
                disabled={disabled}
              />
              {(!selectedUsersAndGroups ||
                selectedUsersAndGroups.length === 0) &&
                !searchInputValue && (
                  <Placeholder>Type the name of a person to invite</Placeholder>
                )}
            </>
          </SelectElement>
          {searchInputValue && (
            <AvailablePeopleWrapper fullWidth={!showMainInviteButton}>
              {isLoadingAvailablePeople ? (
                <Grid container justifyContent="center">
                  <Loader />
                </Grid>
              ) : (
                <>
                  {searchedAvailableUsersAndGroups?.length > 0 ? (
                    searchedAvailableUsersAndGroups.map(
                      (userOrGroup, index) => (
                        <AvailablePeopleItemButton
                          key={userOrGroup.identifier}
                          ref={(element) => {
                            searchedUsersAndGroupsReferences.current[index] =
                              element;
                          }}
                          type="button"
                          onClick={() => handleSelectUserOrGroup(userOrGroup)}
                          onMouseEnter={() => setHoveredItemIndex(index)}
                          isHovered={index === hoveredItemIndex}
                        >
                          <UserName>
                            <UserNameText>{userOrGroup.name}</UserNameText>
                          </UserName>
                          {isUserGroup(userOrGroup) ? (
                            <GroupAvatar size={35} group={userOrGroup} />
                          ) : (
                            <UserAvatar size={35} user={userOrGroup} />
                          )}
                        </AvailablePeopleItemButton>
                      ),
                    )
                  ) : (
                    <EmptyPeopleResult>
                      <AddRecordOption
                        searchValue={searchInputValue}
                        onClick={handleEmptyResultActionClick}
                      />
                    </EmptyPeopleResult>
                  )}
                </>
              )}
            </AvailablePeopleWrapper>
          )}
        </SelectElementWrapper>
      </ClickAwayListener>
      {showMainInviteButton && (
        <ButtonWrapper>
          <Button
            fullWidth
            onClick={handleInviteSelectedUsersAndGroups}
            disabled={selectedUsersAndGroups.length === 0 || disabled}
            size="small"
          >
            Invite
          </Button>
        </ButtonWrapper>
      )} */}
    </Wrapper>
  );
};

export default ListUsersAndGroupsSelect;
