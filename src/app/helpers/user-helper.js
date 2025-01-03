export const UserOrganizationRole = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  MEMBER: 'MEMBER',
  GUEST: 'GUEST',
  DOCK_LITE: 'DOCK_LITE',
  EXTERNAL: 'EXTERNAL',
  DOCK_PRO: 'DOCK_PRO',
  VIEW_ONLY: 'VIEW_ONLY',
};

export const getOrgRole = (roleKey) => {
  switch (roleKey) {
    case UserOrganizationRole.OWNER: {
      return 'Owner/Admin';
    }
    case UserOrganizationRole.ADMIN: {
      return 'Admin';
    }
    case UserOrganizationRole.MEMBER: {
      return 'Member';
    }
    case UserOrganizationRole.GUEST: {
      return 'Guest';
    }
    case UserOrganizationRole.DOCK_LITE: {
      return 'Dock Lite';
    }
    case UserOrganizationRole.DOCK_PRO: {
      return 'Dock Crew';
    }
    default: {
      return '';
    }
  }
};

export const checkIfUserIsOrganizationAdmin = (user) =>
  [
    UserOrganizationRole.ADMIN,
    UserOrganizationRole.OWNER,
    UserOrganizationRole.DOCK_PRO,
  ].includes(user.orgUserRole);

export function isUserGuest(user) {
  return user?.orgUserRole === UserOrganizationRole.GUEST;
}

export function isUserDockLite(user) {
  return user?.orgUserRole === UserOrganizationRole.DOCK_LITE;
}

export function isUserGuestOrDockLite(user) {
  return (
    user?.orgUserRole === UserOrganizationRole.GUEST ||
    user?.orgUserRole === UserOrganizationRole.DOCK_LITE
  );
}

export function isUserDockPro(user) {
  return user?.orgUserRole === UserOrganizationRole.DOCK_PRO;
}

export function isUserViewOnly(user) {
  return user?.orgUserRole === UserOrganizationRole.VIEW_ONLY;
}

export const UserStatus = {
  INVITED: 'INVITED',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  DENIED: 'DENIED',
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
    activeUsers?.find(
      ({ userIdentifier: id }) => id === user?.userIdentifier,
    ) || null;

  if (onlineActiveUser && !onlineActiveUser.idle) return ActivityStatus.ONLINE;

  if (onlineActiveUser && onlineActiveUser.idle) return ActivityStatus.IDLE;

  if (!onlineActiveUser) return ActivityStatus.OFFLINE;
}

export function getUserAvatarUrl(user) {
  if (user && user.userIdentifier)
    return `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }user/profilePicture/${user.userIdentifier}?UserPictureType=PROFILE`;

  return null;
}

export function getUserAvatarThumbnailUrl(user) {
  if (user && user.userIdentifier && user.profileThumbnailPictureHash)
    return `${
      import.meta.env.VITE_HEYDOC_SERVICES_BASE_URL
    }user/profilePicture/${user.userIdentifier}/${
      user.profileThumbnailPictureHash
    }`;

  return null;
}

export function hasProfilePicture(user) {
  return user && user.profileThumbnailPictureHash;
}

/**
 *
 * @param {string | undefined} fullName "LastName, FirstName"
 * @returns {{ firstName: string, lastName: string }}
 */
export const getFirstAndLastNameFromFullName = (fullName) => {
  const [lastName, firstName] = (fullName ?? '')
    .split(',')
    .map((str) => str.trim());

  return {
    firstName: firstName ?? '',
    lastName: lastName ?? '',
  };
};

export function getCurrentUserBasicDetails(currentUser) {
  return {
    itemType: currentUser?.itemType,
    id: currentUser?.id,
    identifier: currentUser?.identifier,
    userId: currentUser?.userId,
    userIdentifier: currentUser?.userIdentifier,
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    userName: currentUser?.userName,
    userStatus: currentUser?.userStatus,
    initials: currentUser?.initials,
    bubbleColor: currentUser?.bubbleColor,
    status: currentUser?.status,
    orgUserRole: currentUser?.orgUserRole,
    taskListUserRole: currentUser?.taskListUserRole,
    name: currentUser?.name,
  };
}
