export const getOrgRole = roleKey => {
  switch (roleKey) {
    case 'OWNER':
      return 'Owner';
    case 'ADMIN':
      return 'Admin';
    case 'MEMBER':
      return 'Member';
    case 'GUEST':
      return 'Guest';
    default:
      return '';
  }
};

export default getOrgRole;
