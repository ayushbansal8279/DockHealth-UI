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

    let userStatusLabel = 'Offline';

    if (!isEmpty(onlineActiveUser) && !onlineActiveUser.idle) {
      userStatusLabel = 'Online';
    } else if (!isEmpty(onlineActiveUser) && onlineActiveUser.idle) {
      userStatusLabel = 'Idle';
    } else if (hiddenMember?.userStatus === 'INVITED') {
      userStatusLabel = 'Pending';
    }
    return { ...hiddenMember, userStatusLabel };
  });
