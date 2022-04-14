export const getMemberStatus = member => {
  const { userStatus, taskListUserRole, orgUserRole } = member;

  switch (userStatus) {
    case 'ACTIVE':
      if (orgUserRole === 'GUEST') return 'Guest';

      if (taskListUserRole === 'ADMIN' || taskListUserRole === 'OWNER')
        return 'List Admin';

      return null;

    case 'PENDING':
      if (orgUserRole === 'GUEST') return 'Approval Pending (Guest)';

      return 'Approval Pending';

    case 'DENIED':
      return 'Denied';

    case 'INVITED':
      if (orgUserRole === 'GUEST') return 'Invitation Pending (Guest)';

      return 'Invitation Pending';

    default:
      return null;
  }
};

export const isMemberPending = member =>
  member.userStatus === 'PENDING' || member.userStatus === 'INVITED';
