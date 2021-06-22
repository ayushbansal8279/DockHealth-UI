/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';

export const getHiddenMembersWithStatusContent = (
  hiddenMembers,
  activeUsersList,
) =>
  hiddenMembers?.map(hiddenMember => {
    const onlineActiveUser =
      activeUsersList?.find(({ userIdentifier }) => {
        return userIdentifier === hiddenMember?.userIdentifier;
      }) || {};

    if (!isEmpty(onlineActiveUser) && !onlineActiveUser.idle) {
      return { ...hiddenMember, userStatusLabel: 'Online' };
    }
    if (!isEmpty(onlineActiveUser) && onlineActiveUser.idle) {
      return { ...hiddenMember, userStatusLabel: 'Idle' };
    }
    if (hiddenMember?.userStatus === 'INVITED') {
      return { ...hiddenMember, userStatusLabel: 'Pending' };
    }
    return { ...hiddenMember, userStatusLabel: 'Offline' };
  });
