/* eslint-disable import/prefer-default-export */
/* eslint-disable sonarjs/no-duplicate-string */
export const getMenuOptionsForMember = (
  member,
  {
    changeUserRole,
    removeUserFromList,
    cancelInviteToList,
    resendInvitationToList,
    resendApprovalRequestToList,
  },
) => {
  const { userStatus, taskListUserRole, userIdentifier } = member;

  switch (userStatus) {
    case 'ACTIVE':
      if (taskListUserRole === 'ADMIN')
        return [
          {
            title: 'Remove as List Admin',
            action: () => {
              changeUserRole(userIdentifier, 'MEMBER');
            },
          },
          {
            title: 'Remove From This List',
            description:
              'If you remove a user they will lose access to this list.',
            action: () => {
              removeUserFromList(userIdentifier);
            },
          },
        ];

      return [
        {
          title: 'Make List Admin',
          description: 'Can edit and delete the list.',
          action: () => {
            changeUserRole(userIdentifier, 'ADMIN');
          },
        },
        {
          title: 'Remove From This List',
          description:
            'If you remove a user they will lose access to this list.',
          action: () => {
            removeUserFromList(userIdentifier);
          },
        },
      ];

    case 'DENIED':
      return [
        {
          title: 'Remove From This List',
          description:
            'If you remove a user they will lose access to this list.',
          action: () => {
            removeUserFromList(userIdentifier);
          },
        },
      ];

    case 'PENDING':
      return [
        {
          title: 'Resend Request to Group Owner(s)',
          action: () => {
            resendApprovalRequestToList(userIdentifier);
          },
        },
        {
          title: 'Cancel Invitation',
          action: () => {
            cancelInviteToList(userIdentifier);
          },
        },
      ];

    case 'INVITED':
      return [
        {
          title: 'Resend Invitation',
          action: () => {
            resendInvitationToList(userIdentifier);
          },
        },
        {
          title: 'Cancel Invitation',
          action: () => {
            cancelInviteToList(userIdentifier);
          },
        },
      ];

    default:
      return null;
  }
};
