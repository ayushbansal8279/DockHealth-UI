/* eslint-disable import/prefer-default-export */
import innerJoin from 'ramda/src/innerJoin';
import { ActivityStatus } from './user-helper';

export const UserGroupType = {
  DEFAULT: 'DEFAULT',
  CUSTOM: 'GROUP',
};

export const DefaultUserGroup = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
};

export const DefaultUserGroupUrl = {
  [DefaultUserGroup.ALL]: 'all',
  [DefaultUserGroup.ACTIVE]: 'active',
};

export function getUserGroupIdentifierByUrlParameter(urlParameter) {
  if (!urlParameter) return DefaultUserGroup.ALL;

  const defaultGroupIdentifier = Object.entries(DefaultUserGroupUrl).find(
    ({ 1: value }) => value === urlParameter,
  )?.[0];

  return defaultGroupIdentifier ?? urlParameter;
}

export function getGroupActivityStatus(group, activeUsers) {
  const { users } = group;

  if (!users || users.length === 0) return null;

  const onlineActiveUsers =
    activeUsers?.length > 0 && users?.length > 0
      ? innerJoin(
          (onlineUsers, groupUsers) =>
            onlineUsers.userIdentifier === groupUsers.userIdentifier,
          activeUsers,
          users,
        )
      : [];

  if (onlineActiveUsers.some(({ idle }) => !idle)) return ActivityStatus.ONLINE;

  if (onlineActiveUsers.some(({ idle }) => idle)) return ActivityStatus.IDLE;

  if (onlineActiveUsers.length === 0) return ActivityStatus.OFFLINE;

  return null;
}

export function getUserGroupAvatarThumbnailUrl(userGroup) {
  if (
    userGroup &&
    userGroup.identifier &&
    userGroup.profileThumbnailPictureHash
  )
    return `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${userGroup.identifier}/${userGroup.profileThumbnailPictureHash}`;

  return null;
}
