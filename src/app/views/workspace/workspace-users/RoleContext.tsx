import React, { createContext, ReactNode, useContext } from 'react';
import { USER_TYPES, WORKSPACE_USER_TYPES } from '../../self-serve/users/helpers';

const getRoleConfig = (contextType = 'organization') => {
  switch (contextType) {
    case 'workspace':
      return WORKSPACE_USER_TYPES;
    case 'organization':
    default:
      return USER_TYPES;
  }
};

const RoleContext = createContext({
  contextType: 'organization',
  roleConfig: getRoleConfig('organization'),
});

interface RoleContextProviderProps {
  contextType?: 'organization' | 'workspace';
  children: ReactNode;
}

export const RoleContextProvider = ({ contextType = 'organization', children }: RoleContextProviderProps) => (
  <RoleContext.Provider value={{ contextType, roleConfig: getRoleConfig(contextType) }}>
    {children}
  </RoleContext.Provider>
);

export const useRoleContext = () => useContext(RoleContext);