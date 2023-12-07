import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { arrayOf, func, shape, string } from 'prop-types';
import debounce from 'lodash.debounce';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import Checkbox from 'components/common/Checkbox/Checkbox';
import Spacing from 'components/common/Spacing';
import { isUserGroup } from 'helpers/user-helper';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { openModal } from 'modal/actions';
import {
  ListContainer,
  MemberRow,
  MemberName,
  ListContentSection,
  NoneOption,
  StyledLink,
  SectionHeader,
} from './styled';

const SharedMembersList = ({
  task,
  selectedMembers: savedSelectedMembers,
  onSelect,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);


  useEffect(() => {
    setSelectedMembers([...savedSelectedMembers]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSelectedMembers]);

  const inputReference = useRef(null);

  const selectMembersWithDebounce = useCallback(
    debounce((selection) => {
      onSelect(selection.map((s) => ({ ...s, userIdentifier: s.identifier })));
      // eslint-disable-next-line no-unused-expressions
      inputReference.current?.focus();
    }, 300),
    [],
  );

  useEffect(() => {
    if (inputReference) {
      // eslint-disable-next-line no-unused-expressions
      inputReference?.current?.focus();
    }
  }, [inputReference]);

  const handleOptionClick = useCallback(
    (event, selectedOption) => {
      event.stopPropagation();
      // eslint-disable-next-line unicorn/prefer-array-some
      const membersToReturn = selectedMembers.find(
        ({ identifier }) => selectedOption?.identifier === identifier,
      )
        ? selectedMembers.filter(
            ({ identifier }) => identifier !== selectedOption?.identifier,
          )
        : [...selectedMembers, selectedOption];
      selectMembersWithDebounce(membersToReturn);
      setSelectedMembers(membersToReturn);
    },
    [selectMembersWithDebounce, selectedMembers],
  );

  const renderSelectOption = useCallback(
    (member, isSelected) => {
      return (
        <MemberRow
          key={member?.identifier}
          isSelected={isSelected}
          onClick={(event) => handleOptionClick(event, member)}
        >
          <Checkbox isChecked={isSelected} />
          <Spacing horizontal={3} />
          {isUserGroup(member) ? (
            <GroupAvatar group={member} hideTooltip />
          ) : (
            <UserAvatar user={member} hideTooltip />
          )}
          <Spacing horizontal={3} />
          <MemberName>{member?.name}</MemberName>
        </MemberRow>
      );
    },
    [handleOptionClick],
  );

  const handleShareTask = () => {
    dispatch(openModal('ShareTask', { taskIdentifier: task?.identifier }));
  };

  return (
    <>
      <ListContainer>
        <SectionHeader>Shared with</SectionHeader>
        <ListContentSection>
          {selectedMembers?.map((member) => {
            return renderSelectOption(member, true);
          })}
          {selectedMembers?.length === 0 && (
            <MemberRow>
              <NoneOption>Nobody</NoneOption>
            </MemberRow>
          )}
          <MemberRow key="share_task_option" onClick={handleShareTask}>
            <StyledLink>Share Task</StyledLink>
          </MemberRow>
        </ListContentSection>
      </ListContainer>
    </>
  );
};

SharedMembersList.propTypes = {
  selectedMembers: arrayOf(
    shape({
      identifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      credentials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
  onSelect: func.isRequired,
  // onError: func,
};

SharedMembersList.defaultProps = {
  // onError: null,
};

export default SharedMembersList;
