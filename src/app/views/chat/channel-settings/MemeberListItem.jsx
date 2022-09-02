import React, { useMemo } from 'react';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import Spacing from 'components/common/Spacing';
import { isUserGroup } from 'helpers/user-helper';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@material-ui/icons/MoreVert';
import { Box } from '@material-ui/core';
import { MemberName, MemberRow } from './styled';

const MemberListItem = ({ member, channel, isSelected, handleOptionClick }) => {
  const menuOptions = useMemo(
    () => [
      {
        name: 'Make Admin',
        onClick: async () => {
          const { userIdentifier: identifier } = member;
          await channel.addOperators([identifier]);
        },
      },
    ],
    [channel, member],
  );

  return (
    <MemberRow
      key={member?.userId}
      isSelected={isSelected}
      onClick={event => handleOptionClick(event, member)}
    >
      {/* <Checkbox isChecked={isSelected} /> */}
      <Spacing horizontal={3} />
      {isUserGroup(member) ? (
        <GroupAvatar group={member} hideTooltip />
      ) : (
        <UserAvatar user={member} hideTooltip />
      )}
      <Spacing horizontal={3} />
      <MemberName>{member.name}</MemberName>
      <>
        <Box m={2} />
        <OptionsMenu options={menuOptions}>
          <MoreVert />
        </OptionsMenu>
      </>
    </MemberRow>
  );
};

export default MemberListItem;
