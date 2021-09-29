/* eslint-disable import/prefer-default-export */
import React from 'react';
import { isEmpty } from 'ramda';
import { HiddenMembersTooltipContainer, HiddenMemberName } from './styled';

export const getHiddenMembersTooltipContent = (
  hiddenMembers,
  activeUsersList,
) =>
  hiddenMembers?.map(hiddenMember => {
    const onlineActiveUser =
      activeUsersList?.find(({ identifier }) => {
        return identifier === hiddenMember?.identifier;
      }) || {};

    let userStatusLabel = 'offline';

    if (!isEmpty(onlineActiveUser) && !onlineActiveUser.idle) {
      userStatusLabel = 'online';
    } else if (!isEmpty(onlineActiveUser) && onlineActiveUser.idle) {
      userStatusLabel = 'idle';
    } else if (hiddenMember?.userStatus === 'INVITED') {
      userStatusLabel = 'pending';
    }

    return (
      <HiddenMembersTooltipContainer key={hiddenMember?.identifier}>
        <HiddenMemberName>{hiddenMember?.name}</HiddenMemberName>
        {userStatusLabel}
      </HiddenMembersTooltipContainer>
    );
  });
