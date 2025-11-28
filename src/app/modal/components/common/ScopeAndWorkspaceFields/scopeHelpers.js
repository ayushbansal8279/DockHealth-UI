export const shouldAddItemToList = (
  workspaceIdentifier,
  currentScope,
  currentWorkspace,
) => {
  const currentContextIsOrg = !workspaceIdentifier;
  const createdInOrg = currentScope === 'organization';
  const currentContextIsWs = !!workspaceIdentifier;
  const createdInSameWs =
    currentScope === 'workspace' &&
    currentWorkspace === workspaceIdentifier;

  return (
    (currentContextIsOrg && createdInOrg) ||
    (currentContextIsWs && createdInSameWs)
  );
};

