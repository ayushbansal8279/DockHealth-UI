import { createFilter } from 'react-search-input';
import pluralize from 'pluralize';

interface WorkspaceMember {
  userStatus: 'ACTIVE' | 'INVITED' | 'PENDING' | 'DENIED';
  workspaceUserRole: 'ADMIN' | 'MEMBER';
}

export const getWorkspaceMemberStatus = (
  member: WorkspaceMember,
): string | null => {
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

export const getFilteredRows = <T>(
  rows: T[] | undefined,
  searchTerm: string,
  keys: string[],
): T[] => {
  if (!rows) return [];
  return searchTerm ? rows.filter(createFilter(searchTerm, keys)) : rows;
};

export const ensureSingular = (word: string) => {
  if (!word) return 'Workspace';
  return pluralize.isSingular(word) ? word : pluralize.singular(word);
};
