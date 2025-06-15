interface WorkspaceMember {
  userStatus: 'ACTIVE' | 'INVITED' | 'PENDING' | 'DENIED';
  workspaceUserRole: 'ADMIN' | 'MEMBER';
}

export const getWorkspaceMemberStatus = (member: WorkspaceMember): string | null => {
  const { userStatus, workspaceUserRole } = member;

  switch (userStatus) {
    case 'ACTIVE': {
      if (workspaceUserRole === 'ADMIN') return 'Admin';
      if (workspaceUserRole === 'MEMBER') return 'Member';
      return null;
    }

    case 'PENDING': {
      return 'Approval Pending';
    }

    case 'DENIED': {
      return 'Denied';
    }

    case 'INVITED': {
      return 'Invitation Pending';
    }

    default: {
      return null;
    }
  }
};