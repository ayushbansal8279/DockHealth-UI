export const UserOrganizationRole = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  MEMBER: 'MEMBER',
  GUEST: 'GUEST',
};

export const getOrgRole = roleKey => {
  switch (roleKey) {
    case UserOrganizationRole.OWNER:
      return 'Owner';
    case UserOrganizationRole.ADMIN:
      return 'Admin';
    case UserOrganizationRole.MEMBER:
      return 'Member';
    case UserOrganizationRole.GUEST:
      return 'Guest';
    default:
      return '';
  }
};

export const checkIfUserIsOrganizationAdmin = user =>
  [UserOrganizationRole.ADMIN, UserOrganizationRole.OWNER].includes(
    user.orgUserRole,
  );

export const UserStatus = {
  INVITED: 'INVITED',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
};

export const ActivityStatus = {
  ONLINE: 'ONLINE',
  IDLE: 'IDLE',
  OFFLINE: 'OFFLINE',
};

export const UserListItemType = {
  USER: 'USER',
  GROUP: 'GROUP',
};

export function isUserGroup(item) {
  return item?.itemType === UserListItemType.GROUP;
}

export function getUserActivityStatus(user, activeUsers) {
  const onlineActiveUser =
    activeUsers?.find(({ userIdentifier: id }) => {
      return id === user?.userIdentifier;
    }) || null;

  if (onlineActiveUser && !onlineActiveUser.idle) return ActivityStatus.ONLINE;

  if (onlineActiveUser && onlineActiveUser.idle) return ActivityStatus.IDLE;

  if (!onlineActiveUser) return ActivityStatus.OFFLINE;

  return undefined;
}

export function getUserAvatarUrl(user) {
  if (user && user.userIdentifier)
    return `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${user.userIdentifier}?UserPictureType=PROFILE`;

  return null;
}

export function getUserAvatarThumbnailUrl(user) {
  if (user && user.userIdentifier && user.profileThumbnailPictureHash)
    return `${process.env.HEYDOC_SERVICES_BASE_URL}user/profilePicture/${user.userIdentifier}/${user.profileThumbnailPictureHash}`;

  return null;
}

export function hasProfilePicture(user) {
  return user && user.profileThumbnailPictureHash;
}
