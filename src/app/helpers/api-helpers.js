export const withWorkspaceHeaders = (workspaceIdentifier) => ({
  headers: workspaceIdentifier
    ? { CurrentWorkspaceIdentifier: workspaceIdentifier }
    : undefined,
});