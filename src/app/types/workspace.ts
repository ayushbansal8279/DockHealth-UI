export type Workspace = {
  workspaceIdentifier: string;
  workspaceName: string;
  workspaceInitials: string;
  workspaceProfileColor: string;
  parentOrganization?: organization;
  active: boolean;
  createdDateTime: string;
};

export type createWorkspacePayload = {
  parentOrganizationIdentifier: string;
  workspaceName: string;
};

export type organization = {
  organizationIdentifier: string;
  organizationName: string;
  organizationInitials: string;
  organizationProfileColor: string;
};
