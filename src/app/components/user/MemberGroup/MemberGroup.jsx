import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import { arrayOf, number, shape, string } from 'prop-types';
import { userProfileSelector } from 'selectors/user-selectors';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import { isUserGroup } from 'helpers/user-helper';
import { GroupContainer, GroupItem, NameWrapper } from './styled';
import AdditionalMembersCounter from '../AdditionalMembersCounter/AdditionalMembersCounter';

const MemberGroup = ({ members, max, size }) => {
  const currentUser = useSelector(userProfileSelector);
  const sortedUsersOrAndGroups = useMemo(
    () =>
      members?.slice().sort((a, b) => {
        if (a?.identifier === currentUser?.identifier) return -1;

        if (b?.identifier === currentUser?.identifier) return 1;

        return a?.lastName?.localeCompare(b?.lastName);
      }),
    [members, currentUser],
  );

  const [shownMembers, hiddenMembers] = useMemo(
    () =>
      sortedUsersOrAndGroups?.length > max
        ? [
            sortedUsersOrAndGroups.slice(0, max - 1),
            sortedUsersOrAndGroups.slice(max - 1),
          ]
        : [sortedUsersOrAndGroups, null],

    [max, sortedUsersOrAndGroups],
  );

  return (
    <GroupContainer>
      <>
        {members?.map((member, index) => (
          <NameWrapper key={member?.identifier}>{`
        ${member?.name}${index !== shownMembers.length - 1 ? ', ' : ''}
        `}</NameWrapper>
        ))}
      </>
      {shownMembers?.map((member, index) => (
        <GroupItem
          key={member?.identifier}
          zIndex={shownMembers.length - index}
        >
          {isUserGroup(member) ? (
            <GroupAvatar size={size} group={member} />
          ) : (
            <UserAvatar user={member} size={size} />
          )}
        </GroupItem>
      ))}
      {hiddenMembers && (
        <GroupItem zIndex={0}>
          <AdditionalMembersCounter hiddenMembers={hiddenMembers} size={size} />
        </GroupItem>
      )}
    </GroupContainer>
  );
};

MemberGroup.propTypes = {
  max: number,
  size: number,
  members: arrayOf(
    shape({
      identifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
};

MemberGroup.defaultProps = {
  max: 3,
  size: 30,
};

export default MemberGroup;
