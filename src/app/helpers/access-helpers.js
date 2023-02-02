export const hasAccessToElement = (userRole, allowedToRoles) => {
  if (!allowedToRoles) return true;
  if (!userRole) return null;
  if (typeof allowedToRoles === 'string') return allowedToRoles === userRole;
  if (Array.isArray(allowedToRoles)) {
    // eslint-disable-next-line unicorn/prefer-includes
    return !!allowedToRoles.some((r) => r === userRole);
  }
};
