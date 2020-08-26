/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { MemberStatusLabel } from './styled';

export const isMemberPending = member =>
  member.userStatus === 'PENDING' || member.userStatus === 'INVITED';

export const getMemberStatusLabel = member => {
  const { userStatus, taskListUserRole } = member;

  switch (userStatus) {
    case 'ACTIVE':
      if (taskListUserRole === 'ADMIN')
        return <MemberStatusLabel>List Admin</MemberStatusLabel>;

      return null;

    case 'PENDING':
      return <MemberStatusLabel>Approval Pending</MemberStatusLabel>;

    case 'DENIED':
      return <MemberStatusLabel>Denied</MemberStatusLabel>;

    case 'INVITED':
      return <MemberStatusLabel>Invitation Pending</MemberStatusLabel>;

    default:
      return null;
  }
};

export const getMenuOptionsForMember = (
  member,
  {
    changeUserRole,
    removeUserFromList,
    cancelInviteToList,
    resendInvitationToList,
  },
) => {
  const { userStatus, taskListUserRole, userIdentifier } = member;

  switch (userStatus) {
    case 'ACTIVE':
      if (taskListUserRole === 'ADMIN')
        return [
          {
            title: 'List Member',
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
          title: 'List admin',
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
            // TODO(maciek): check endpoint for resending approval request
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
