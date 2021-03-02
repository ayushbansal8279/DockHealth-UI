import React, { useMemo } from 'react';
import Member from 'components/members/Member/Member';
import { arrayOf, number, shape, string } from 'prop-types';
import { GroupContainer, GroupItem } from './styled';
import AdditionalMembersCounter from '../AdditionalMembersCounter/AdditionalMembersCounter';

const MemberGroup = ({ members, max, size }) => {
  const [shownMembers, hiddenMembers] = useMemo(
    () =>
      members?.length > max
        ? [members.slice(0, max - 1), members.slice(max - 1)]
        : [members, null],

    [max, members],
  );

  return (
    <GroupContainer>
      {shownMembers?.map((member, index) => (
        <GroupItem
          key={member?.userIdentifier}
          zIndex={shownMembers.length - index}
        >
          <Member member={member} size={size} />
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
      userIdentifier: string,
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
