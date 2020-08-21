import React, { useState, useRef } from 'react';
import Button from 'components/common/Button/Button';
import {
  Wrapper,
  Placeholder,
  SelectElement,
  ButtonWrapper,
  PlaceholderContainer,
  MemberItemWrapper,
  MemberName,
  RemoveMemberButton,
  RemoveMemberIcon,
  SearchInput,
} from './styled';
import spacing from 'styles/spacing';

const ListMembersSelect = ({ availablePeople, currentUser }) => {
  console.log('currentUser', currentUser);
  console.log('availablePeople', availablePeople);

  const searchInputReference = useRef(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const removeSelectedMember = fullName => {
    setSelectedMembers(currentSelectedMembers =>
      currentSelectedMembers.filter(member => member !== fullName),
    );
  };

  const handleSearchInputKeyDown = () => {
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
      <SelectElement type="button" onClick={handleSelectClick}>
        {selectedMembers?.length > 0 ? (
          <>
            {selectedMembers.map((fullName, index) => (
              <MemberItemWrapper key={fullName + index}>
                <MemberName>{fullName}</MemberName>
                <RemoveMemberButton
                  type="button"
                  onClick={() => removeSelectedMember(fullName)}
                >
                  <RemoveMemberIcon />
                </RemoveMemberButton>
              </MemberItemWrapper>
            ))}
            <SearchInput
              ref={searchInputReference}
              onKeyDown={handleSearchInputKeyDown}
            />
          </>
        ) : (
          <PlaceholderContainer>
            <Placeholder>Type the nameof a the person to invite</Placeholder>
          </PlaceholderContainer>
        )}
      </SelectElement>
      <ButtonWrapper>
        <Button fullWidth size="small" onClick={() => {}}>
          Invite
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ListMembersSelect;
