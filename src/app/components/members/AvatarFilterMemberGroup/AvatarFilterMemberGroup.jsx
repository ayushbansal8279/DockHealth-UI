import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import AvatarFilterMember from 'components/members/AvatarFilterMember/AvatarFilterMember';
import { arrayOf, number, shape, string } from 'prop-types';
import { userProfileSelector } from 'selectors/user-selectors';
import { GroupContainer, GroupItem } from './styled';
import AdditionalMembersCounter from '../AdditionalMembersCounter/AdditionalMembersCounter';

const AvatarFilterMemberGroup = ({ members, max, size }) => {
  const currentUser = useSelector(userProfileSelector);

  const sortedMembers = useMemo(
    () =>
      members.slice().sort((a, b) => {
        if (a?.userIdentifier === currentUser?.userIdentifier) return -1;

        if (b?.userIdentifier === currentUser?.userIdentifier) return 1;

        return a?.lastName?.localeCompare(b?.lastName);
      }),
    [members, currentUser],
  );

  const [shownMembers, hiddenMembers] = useMemo(
    () =>
      sortedMembers?.length > max
        ? [sortedMembers.slice(0, max - 1), sortedMembers.slice(max - 1)]
        : [sortedMembers, null],

    [max, sortedMembers],
  );

  return (
    <GroupContainer>
      {shownMembers?.map((member, index) => (
        <GroupItem
          key={member?.userIdentifier}
          zIndex={shownMembers.length - index}
        >
          <AvatarFilterMember member={member} size={size} />
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

AvatarFilterMemberGroup.propTypes = {
  max: number,
  size: number,
  members: arrayOf(
    shape({
      userIdentifier: string,
      firstName: string,
      lastName: string,
      initials: string,
      profileThumbnailPictureHash: string,
    }),
  ).isRequired,
};

AvatarFilterMemberGroup.defaultProps = {
  max: 3,
  size: 30,
};

export default AvatarFilterMemberGroup;
