import * as ActionTypes from 'actions/action-types';

export type Workspace = {
  workspaceIdentifier: string;
  workspaceName: string;
  workspaceInitials: string;
  workspaceProfileColor: string;
  parentOrganization?: organization;
  active: boolean;
  createdDateTime: string;
  isFetchingWorkspaceUsers?: boolean;
  workspaceUsers?: WorkspaceUser[] | null;
  workspaceUsersError?: any;
};

export type createWorkspacePayload = {
  workspaceIdentifier: string;
  parentOrganizationIdentifier: string;
  workspaceName: string;
};

export type organization = {
  organizationIdentifier: string;
  organizationName: string;
  organizationInitials: string;
  organizationProfileColor: string;
};

export type WorkspaceUser = {
  // itemType: 'USER';
  identifier: string;
  userIdentifier: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  userStatus: 'ACTIVE' | 'INACTIVE';
  workspaceUserRole: 'ADMIN' | 'MEMBER';
  initials: string;
  bubbleColor: string;
  name: string;
};

export interface ChangeUserRolePayload {
  workspaceIdentifier: string;
  userIdentifier: string;
  role: string;
}

export interface InviteUserToWorkspacePayload {
  userIdentifier: string;
  workspaceIdentifier: string;
  onDone?: () => void;
}

export interface RemoveUserFromWorkspacePayload {
  userIdentifier: string;
  workspaceIdentifier: string;
  refreshListUsersAndGroups?: () => void;
}

export interface InvitePersonToWorkspacePayload {
  workspaceIdentifier: string;
  data: {
    firstName: string;
    lastName: string;
    userRole: 'MEMBER' | 'ADMIN' | 'OWNER';
    email: string;
  };
  onSuccess?: () => void;
  onFailure?: (error?: any) => void;
}