export const USER_STATUS_TYPES = new Proxy(
  {
    INACTIVE: {
      label: 'Inactive',
    },
    CANCELLED: {
      label: 'Cancelled',
      invitationModifiable: true,
    },
    DEFAULT: {
      label: 'Invited',
      invitationModifiable: true,
    },
    PENDING: {
      label: 'Approval Pending',
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

export const USER_TYPES = new Proxy(
  {
    OWNER: {
      label: 'Owner',
      selectable: true,
      changeable: true,
      description:
        'Full access to everything including billing and payments and approving new members.',
    },
    MEMBER: {
      label: 'Member',
      selectable: true,
      changeable: true,
      description:
        'Part of your Organization. Can add and invite members who are already part of your organization. Can access all patients/clients and people in the group/practice.',
    },
    GUEST: {
      label: 'Guest',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'An outside collaborator you can invite into selected lists, who will only have access to the tasks, patients/clients and people who are part of those lists.',
    },
    DOCK_PRO: {
      label: 'Dock Pro',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description:
        'A Dock Pro user will have admin access to setup the configurations and workflows for your team.',
    },
    VIEW_ONLY: {
      label: 'View Only',
      selectable: true,
      changeable: true,
      isLimitedAccess: true,
      description: '',
    },
    DEFAULT: {
      label: 'Invited',
      invitationModifiable: true,
    },
  },
  {
    get: (object, path) => object[path?.toUpperCase()] || object.DEFAULT,
  },
);

export const getUserTypeLabel = ({
  userStatus,
  // eulaAcknowledged,
  orgUserRole,
}) => {
  let userType = null;
  if (['CANCELLED', 'INACTIVE', 'PENDING'].includes(userStatus)) {
    userType = USER_STATUS_TYPES[userStatus];
  } else {
    const derivedOrgUserRole = ['ACTIVE', 'INACTIVE'].includes(userStatus)
      ? orgUserRole
      : '';
    userType = USER_TYPES[derivedOrgUserRole];
  }

  return userType;
};
