import React, { useState, useRef, useMemo } from 'react';
import Button from 'components/common/Button/Button';
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
} from './styled';

const ListMembersSelect = ({ availablePeople, currentUser }) => {
  const searchInputReference = useRef(null);
  const [selectedMembers, setSelectedMembers] = useState([
    { userIdentifier: 'sdfasdf', userName: 'Maciej Laufer' },
    { userIdentifier: 'sdfasdfdd', userName: 'Maciej Tester2' },
    { userIdentifier: 'sdfasdfsds', userName: 'Maciej Tester3' },
    { userIdentifier: 'sdfasdfsdsss', userName: 'Maciej Tester4' },
    { userIdentifier: 'sdfasdfsdsaaaa', userName: 'Maciej Tester5' },
  ]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);

  const searchedAvailablePeople = useMemo(
    () =>
      availablePeople.filter(({ userName }) =>
        userName.toLowerCase().includes(searchInputValue),
      ),
    [searchInputValue, availablePeople],
  );

  const removeSelectedMember = userIdentifier => {
    setSelectedMembers(currentSelectedMembers =>
      currentSelectedMembers.filter(
        member => member.userIdentifier !== userIdentifier,
      ),
    );
  };

  const handleSearchInputKeyDown = event => {
    // handling esc press
    if (event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      searchInputReference.current.blur();
      setSearchInputValue('');
    }

    if (searchInputReference.current) {
      if (!searchInputReference.current?.value) {
        searchInputReference.current.style.width = 20;
        return;
      }

      // set content width plus input padding value
      searchInputReference.current.style.width =
        searchInputReference.current?.scrollWidth + 8;
    }
  };

  const handleSelectClick = event => {
    event.preventDefault();
    event.stopPropagation();

    if (searchInputReference?.current) {
      searchInputReference.current.focus();
    }
  };

  return (
    <Wrapper>
      <SelectElement
        withValue={searchInputValue}
        type="button"
        onClick={handleSelectClick}
      >
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
            onFocus={() => setIsSearchInputFocused(true)}
            onBlur={() => setIsSearchInputFocused(false)}
          />
          {(!selectedMembers || selectedMembers.length === 0) &&
            !searchInputValue && (
              <Placeholder>Type the nameof a the person to invite</Placeholder>
            )}
        </>
      </SelectElement>
      {searchInputValue && isSearchInputFocused && (
        <AvailablePeopleWrapper>
          {searchedAvailablePeople.map(({ userName }) => (
            <div>{userName}</div>
          ))}
        </AvailablePeopleWrapper>
      )}
      <ButtonWrapper>
        <Button fullWidth size="small" onClick={() => {}}>
          Invite
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ListMembersSelect;
