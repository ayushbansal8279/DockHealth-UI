import React, { useState, useRef, useMemo } from 'react';
import Button from 'components/common/Button/Button';
import Member from 'components/members/Member';
import { ClickAwayListener, Grid } from '@material-ui/core';
import Loader from 'components/common/Loader/Loader';
import {
  Wrapper,
  Placeholder,
  SelectElement,
  ButtonWrapper,
  MemberItemWrapper,
  MemberName,
  RemoveMemberButton,
  RemoveMemberIcon,
  SearchInput,
  AvailablePeopleWrapper,
  AvailablePeopleItemButton,
  UserName,
  UserNameText,
  SelectElementWrapper,
  EmptyPeopleResult,
  EmptyResultText,
  EmptyResultButton,
} from './styled';

const ListMembersSelect = ({
  disabled,
  availablePeople,
  isLoadingAvailablePeople,
  onAcitonButtonClick,
  emptyListAction,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const searchInputReference = useRef(null);
  const searchedPeopleReferences = useRef([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [hoveredItemIndex, setHoveredItemIndex] = useState(0);

  const searchedAvailablePeople = useMemo(
    () =>
      availablePeople.filter(
        ({ userName, userIdentifier }) =>
          userName.toLowerCase().includes(searchInputValue) &&
          !selectedMembers.some(
            selectedMember => selectedMember.userIdentifier === userIdentifier,
          ),
      ),
    [searchInputValue, availablePeople, selectedMembers],
  );

  const removeSelectedMember = userIdentifier => {
    setSelectedMembers(currentSelectedMembers =>
      currentSelectedMembers.filter(
        member => member.userIdentifier !== userIdentifier,
      ),
    );
  };

  const handleSelectMember = member => {
    setSelectedMembers(perviousSelectedMember => [
      ...perviousSelectedMember,
      member,
    ]);
    setSearchInputValue('');
    searchInputReference.current.focus();
  };

  const handleInviteSelectedPeople = () => {
    if (selectedMembers?.length > 0) {
      onAcitonButtonClick(selectedMembers);
      setSelectedMembers([]);
    }
  };

  const handleEmptyResultActionClick = () => {
    emptyListAction(searchInputValue);
    setSearchInputValue('');
    searchInputReference.current.blur();
  };

  const handleSearchInputKeyDown = event => {
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
          searchedAvailablePeople?.length > 0
        ) {
          handleSelectMember(searchedAvailablePeople[hoveredItemIndex]);
          break;
        }

        if (selectedMembers?.length > 0) {
          handleInviteSelectedPeople();
          break;
        }

        if (searchedAvailablePeople?.length === 0) {
          handleEmptyResultActionClick();
          break;
        }
        break;

      // down arrow key
      case 40:
        event.preventDefault();
        event.stopPropagation();
        setHoveredItemIndex(previousIndex => {
          let newIndex;
          if (previousIndex === searchedAvailablePeople.length - 1) {
            newIndex = 0;
          } else {
            newIndex = previousIndex + 1;
          }

          searchedPeopleReferences.current[newIndex].scrollIntoView(false);
          return newIndex;
        });
        break;

      // up arrow key
      case 38:
        event.preventDefault();
        event.stopPropagation();
        setHoveredItemIndex(previousIndex => {
          let newIndex;
          if (previousIndex === 0) {
            newIndex = searchedAvailablePeople.length - 1;
          } else {
            newIndex = previousIndex - 1;
          }

          searchedPeopleReferences.current[newIndex].scrollIntoView(true);
          return newIndex;
        });
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

  const handleSelectAreaClick = event => {
    event.preventDefault();
    event.stopPropagation();

    if (searchInputReference?.current) {
      searchInputReference.current.focus();
    }
  };

  return (
    <Wrapper>
      <ClickAwayListener onClickAway={() => setSearchInputValue('')}>
        <SelectElementWrapper withValue={searchInputValue}>
          <SelectElement type="button" onClick={handleSelectAreaClick}>
            <>
              {selectedMembers.map(member => (
                <MemberItemWrapper key={member.userIdentifier}>
                  <MemberName>{member.userName}</MemberName>
                  <RemoveMemberButton
                    type="button"
                    onClick={() => removeSelectedMember(member.userIdentifier)}
                  >
                    <RemoveMemberIcon />
                  </RemoveMemberButton>
                </MemberItemWrapper>
              ))}
              <SearchInput
                ref={searchInputReference}
                onKeyDown={handleSearchInputKeyDown}
                value={searchInputValue}
                onChange={event => setSearchInputValue(event.target.value)}
                disabled={disabled}
              />
              {(!selectedMembers || selectedMembers.length === 0) &&
                !searchInputValue && (
                  <Placeholder>
                    Type the name of a the person to invite
                  </Placeholder>
                )}
            </>
          </SelectElement>
          {searchInputValue && (
            <AvailablePeopleWrapper>
              {isLoadingAvailablePeople ? (
                <Grid container justify="center">
                  <Loader />
                </Grid>
              ) : (
                <>
                  {searchedAvailablePeople?.length > 0 ? (
                    searchedAvailablePeople.map((person, index) => (
                      <AvailablePeopleItemButton
                        key={person.userIdentifier}
                        ref={element => {
                          searchedPeopleReferences.current[index] = element;
                        }}
                        type="button"
                        onClick={() => handleSelectMember(person)}
                        onMouseEnter={() => setHoveredItemIndex(index)}
                        isHovered={index === hoveredItemIndex}
                      >
                        <UserName>
                          <UserNameText>{person.userName}</UserNameText>
                        </UserName>
                        <Member size={38} member={person} />
                      </AvailablePeopleItemButton>
                    ))
                  ) : (
                    <EmptyPeopleResult>
                      <EmptyResultText>No record found</EmptyResultText>
                      {typeof emptyListAction === 'function' && (
                        <EmptyResultButton
                          type="button"
                          onClick={handleEmptyResultActionClick}
                        >
                          Invite
                        </EmptyResultButton>
                      )}
                    </EmptyPeopleResult>
                  )}
                </>
              )}
            </AvailablePeopleWrapper>
          )}
        </SelectElementWrapper>
      </ClickAwayListener>
      <ButtonWrapper>
        <Button
          fullWidth
          size="small"
          onClick={handleInviteSelectedPeople}
          disabled={selectedMembers.length === 0 || disabled}
        >
          Invite
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ListMembersSelect;
