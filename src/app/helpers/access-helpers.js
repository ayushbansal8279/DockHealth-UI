export const hasAccessToElement = (userRole, allowedToRoles) => {
  if (!allowedToRoles) return true;
  if (!userRole) return null;
  if (typeof allowedToRoles === 'string') return allowedToRoles === userRole;
  if (Array.isArray(allowedToRoles)) {
    return !!allowedToRoles.find(r => r === userRole);
  }
};
