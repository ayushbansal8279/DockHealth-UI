import React, { useState, useRef, useMemo } from 'react';
import Button from 'components/common/Button/Button';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { ClickAwayListener, Grid } from '@mui/material';
import Loader from 'components/common/Loader/Loader';
import AddRecordOption from 'components/common/AddRecordOption/AddRecordOption';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import {
  Wrapper,
  Placeholder,
  SelectElement,
  ButtonWrapper,
  ItemWrapper,
  ItemName,
  RemoveItemButton,
  RemoveItemIcon,
  SearchInput,
  AvailablePeopleWrapper,
  AvailablePeopleItemButton,
  UserName,
  UserNameText,
  SelectElementWrapper,
  EmptyPeopleResult,
} from './styled';

const ListUsersAndGroupsSelect = ({
  disabled,
  usersAndGroups,
  isLoadingAvailablePeople,
  onActionButtonClick,
  emptyListAction,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const searchInputReference = useRef(null);
  const searchedUsersAndGroupsReferences = useRef([]);
  const [selectedUsersAndGroups, setSelectedUsersAndGroups] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [hoveredItemIndex, setHoveredItemIndex] = useState(0);

  const searchedAvailableUsersAndGroups = useMemo(
    () =>
      usersAndGroups.filter(({ name, email, identifier }) => {
        const searchValue = searchInputValue.toLowerCase();
        return (
          (name?.toLowerCase().includes(searchValue) ||
            email?.toLowerCase().startsWith(searchValue)) &&
          !selectedUsersAndGroups.some(
            (selectedUserAndGroup) =>
              selectedUserAndGroup.identifier === identifier,
          )
        );
      }),
    [searchInputValue, usersAndGroups, selectedUsersAndGroups],
  );

  const showMainInviteButton =
    !searchInputValue || searchedAvailableUsersAndGroups.length > 0;

  const removeSelectedUserOrGroup = (identifier) => {
    setSelectedUsersAndGroups((currentSelectedUsersAndGroups) =>
      currentSelectedUsersAndGroups.filter(
        (userOrGroup) => userOrGroup.identifier !== identifier,
      ),
    );
  };

  const handleSelectUserOrGroup = (userOrGroup) => {
    setSelectedUsersAndGroups((perviousSelectedUserAndGroup) => [
      ...perviousSelectedUserAndGroup,
      userOrGroup,
    ]);
    setSearchInputValue('');
    searchInputReference.current.focus();
  };

  const handleInviteSelectedUsersAndGroups = () => {
    if (selectedUsersAndGroups?.length > 0) {
      onActionButtonClick(
        selectedUsersAndGroups.map((s) => ({
          ...s,
          userIdentifier: s.identifier,
        })),
      );
      setSelectedUsersAndGroups([]);
    }
  };

  const handleEmptyResultActionClick = () => {
    emptyListAction(searchInputValue);
    setSearchInputValue('');
    searchInputReference.current.blur();
  };

  const handleSearchInputKeyDown = (event) => {
    switch (event.keyCode) {
      // esc key
      case 27:
        event.preventDefault();
        event.stopPropagation();
        searchInputReference.current.blur();
        setSearchInputValue('');
        break;

      // enter key
      case 13:
        event.preventDefault();
        event.stopPropagation();
        if (
          searchInputReference.current?.value &&
          searchedAvailableUsersAndGroups?.length > 0
        ) {
          handleSelectUserOrGroup(
            searchedAvailableUsersAndGroups[hoveredItemIndex],
          );
          break;
        }

        if (
          searchInputReference.current?.value &&
          searchedAvailableUsersAndGroups?.length === 0
        ) {
          handleEmptyResultActionClick();
          break;
        }

        if (selectedUsersAndGroups?.length > 0) {
          handleInviteSelectedUsersAndGroups();
          break;
        }

        break;

      // down arrow key
      case 40:
        event.preventDefault();
        event.stopPropagation();

        if (searchedAvailableUsersAndGroups?.length > 0) {
          setHoveredItemIndex((previousIndex) => {
            let newIndex;
            if (previousIndex === searchedAvailableUsersAndGroups.length - 1) {
              newIndex = 0;
            } else {
              newIndex = previousIndex + 1;
            }

            searchedUsersAndGroupsReferences.current[newIndex].scrollIntoView(
              false,
            );
            return newIndex;
          });
        }

        break;

      // up arrow key
      case 38:
        event.preventDefault();
        event.stopPropagation();

        if (searchedAvailableUsersAndGroups?.length > 0) {
          setHoveredItemIndex((previousIndex) => {
            let newIndex;
            if (previousIndex === 0) {
              newIndex = searchedAvailableUsersAndGroups.length - 1;
            } else {
              newIndex = previousIndex - 1;
            }

            searchedUsersAndGroupsReferences.current[newIndex].scrollIntoView(
              true,
            );
            return newIndex;
          });
        }

        break;

      default:
        // set content width plus input padding value
        searchInputReference.current.style.width =
          searchInputReference.current?.scrollWidth + 8;
        searchInputReference.current.scrollIntoView(true);
        break;
    }

    if (!searchInputReference.current?.value) {
      searchInputReference.current.style.width = 20;
    }
  };

  const handleSelectAreaClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (searchInputReference?.current) {
      searchInputReference.current.focus();
    }
  };

  return (
    <Wrapper>
      <ClickAwayListener onClickAway={() => setSearchInputValue('')}>
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
                            <GroupAvatar size={38} group={userOrGroup} />
                          ) : (
                            <UserAvatar size={38} user={userOrGroup} />
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
      )}
    </Wrapper>
  );
};

export default ListUsersAndGroupsSelect;
