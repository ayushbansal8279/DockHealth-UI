import React, { useMemo } from 'react';
import UserAvatar from 'components/user/UserAvatar/UserAvatar';
import GroupAvatar from 'components/user/GroupAvatar/GroupAvatar';
import Spacing from 'components/common/Spacing';
import { isUserGroup } from 'helpers/user-helper';
import OptionsMenu from 'components/common/OptionsMenu/OptionsMenu';
import MoreVert from '@mui/icons-material/MoreVert';
import { Box } from '@mui/material';
import { MemberName, MemberRow } from './styled';

const MemberListItem = ({
  member,
  channelMember,
  channel,
  isSelected,
  handleOptionClick,
}) => {
  const menuOptions = useMemo(
    () =>
      channelMember?.role === 'operator'
        ? []
        : [
            {
              name: 'Make Admin',
              onClick: async () => {
                const { userIdentifier: identifier } = member;
                await channel.addOperators([identifier]);
              },
            },
          ],
    [channel, member, channelMember],
  );

  return (
    <MemberRow
      key={member?.userIdentifier}
      isSelected={isSelected}
      onClick={(event) => handleOptionClick(event, member)}
    >
      <Spacing horizontal={3} />
      {isUserGroup(member) ? (
        <GroupAvatar group={member} hideTooltip />
      ) : (
        <UserAvatar user={member} hideTooltip />
      )}
      <Spacing horizontal={3} />
      <MemberName>
        {member.name} {channelMember?.role === 'operator' ? '(Admin)' : ''}
      </MemberName>
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
