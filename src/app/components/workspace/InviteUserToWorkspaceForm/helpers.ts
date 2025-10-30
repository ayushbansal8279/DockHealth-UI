interface WorkspaceMember {
  userIdentifier: string;
  userStatus: 'ACTIVE' | 'INVITED' | 'PENDING' | 'DENIED';
  workspaceUserRole: 'ADMIN' | 'MEMBER';
}

interface WorkspaceMenuHandlers {
  changeUserRole: (userId: string, newRole: 'ADMIN' | 'MEMBER') => void;
  removeUserFromWorkspace: (userId: string) => void;
  cancelInviteToWorkspace?: (userId: string) => void;
  resendInvitationToWorkspace?: (userId: string) => void;
  workspaceLabel: string;
}

export const getMenuOptionsForWorkspaceUser = (
  member: WorkspaceMember,
  {
    changeUserRole,
    removeUserFromWorkspace,
    cancelInviteToWorkspace,
    resendInvitationToWorkspace,
    workspaceLabel,
  }: WorkspaceMenuHandlers
) => {
  const { userIdentifier, userStatus, workspaceUserRole } = member;

  switch (userStatus) {
    case 'ACTIVE': {
      const oppositeRole = workspaceUserRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';

      return [
        {
          name: oppositeRole.charAt(0) + oppositeRole.slice(1).toLowerCase(),
          onClick: () => changeUserRole(userIdentifier, oppositeRole),
        },
        {
          name: `Remove From ${workspaceLabel}`,
          onClick: () => removeUserFromWorkspace(userIdentifier),
        },
      ];
    }

    case 'INVITED': {
      return [
        {
          name: 'Resend Invitation',
          onClick: () => resendInvitationToWorkspace?.(userIdentifier),
        },
        {
          name: 'Cancel Invitation',
          onClick: () => cancelInviteToWorkspace?.(userIdentifier),
        },
      ];
    }

    case 'PENDING':
    case 'DENIED': {
      return [
        {
          name: `Remove From ${workspaceLabel}`,
          onClick: () => removeUserFromWorkspace(userIdentifier),
        },
      ];
    }

    default:
      return null;
  }
};