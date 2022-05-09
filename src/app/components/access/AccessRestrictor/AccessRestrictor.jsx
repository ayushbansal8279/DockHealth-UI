import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';

const AccessRestrictor = ({ children, allowedToRoles }) => {
  const { orgUserRole } = useSelector(userProfileSelector);

  if (!allowedToRoles) return children;

  if (typeof allowedToRoles === 'string') {
    return allowedToRoles === orgUserRole ? children : null;
  }
  if (Array.isArray(allowedToRoles)) {
    const matched = allowedToRoles.find(r => r === orgUserRole);
    return matched ? children : null;
  }
  return children;
};

export default AccessRestrictor;
