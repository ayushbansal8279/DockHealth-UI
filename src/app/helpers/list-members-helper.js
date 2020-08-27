export const getMemberStatus = member => {
  const { userStatus, taskListUserRole } = member;

  switch (userStatus) {
    case 'ACTIVE':
      if (taskListUserRole === 'ADMIN') return 'List Admin';

      return null;

    case 'PENDING':
      return 'Approval Pending';

    case 'DENIED':
      return 'Denied';

    case 'INVITED':
      return 'Invitation Pending';

    default:
      return null;
  }
};

export const isMemberPending = member =>
  member.userStatus === 'PENDING' || member.userStatus === 'INVITED';
