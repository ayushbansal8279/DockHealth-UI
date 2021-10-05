/* eslint-disable import/prefer-default-export */
/* eslint-disable sonarjs/no-duplicate-string */
import { string } from 'yup';

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
  const {
    userStatus,
    taskListUserRole,
    orgUserRole,
    userIdentifier,
    identifier,
    itemType,
  } = member;

  if (itemType === 'GROUP') {
    return [
      {
        name: 'Remove From This List',
        description:
          'If you remove a group they will lose access to this list.',
        onClick: () => {
          removeUserFromList(identifier);
        },
      },
    ];
  }

  switch (userStatus) {
    case 'ACTIVE':
      if (taskListUserRole === 'ADMIN') {
        return [
          {
            name: 'Remove as List Admin',
            onClick: () => {
              changeUserRole(userIdentifier, 'MEMBER');
            },
          },
          {
            name: 'Remove From This List',
            description:
              'If you remove a user they will lose access to this list.',
            onClick: () => {
              removeUserFromList(userIdentifier);
            },
          },
        ];
      }
      if (orgUserRole === 'GUEST') {
        return [
          {
            name: 'Remove From This List',
            description:
              'If you remove a user they will lose access to this list.',
            onClick: () => {
              removeUserFromList(userIdentifier);
            },
          },
        ];
      }
      return [
        {
          name: 'Make List Admin',
          description: 'Can edit and delete the list.',
          onClick: () => {
            changeUserRole(userIdentifier, 'ADMIN');
          },
        },
        {
          name: 'Remove From This List',
          description:
            'If you remove a user they will lose access to this list.',
          onClick: () => {
            removeUserFromList(userIdentifier);
          },
        },
      ];

    case 'DENIED':
      return [
        {
          name: 'Remove From This List',
          description:
            'If you remove a user they will lose access to this list.',
          onClick: () => {
            removeUserFromList(userIdentifier);
          },
        },
      ];

    case 'PENDING':
      return [
        {
          name: 'Resend Request to Group Owner(s)',
          onClick: () => {
            resendApprovalRequestToList(userIdentifier);
          },
        },
        {
          name: 'Cancel Invitation',
          onClick: () => {
            cancelInviteToList(userIdentifier);
          },
        },
      ];

    case 'INVITED':
      return [
        {
          name: 'Resend Invitation',
          onClick: () => {
            resendInvitationToList(userIdentifier);
          },
        },
        {
          name: 'Cancel Invitation',
          onClick: () => {
            cancelInviteToList(userIdentifier);
          },
        },
      ];

    default:
      return null;
  }
};

export const isEmail = value => {
  return string()
    .email()
    .isValidSync(value);
};
