import { useFormContext } from 'react-hook-form';

export const useScopeAndWorkspace = () => {
  const { watch } = useFormContext();

  const scope = watch('scope');
  const selectedWorkspace = watch('selectedWorkspace');

  const getFinalWorkspaceIdentifier = () => {
    return scope === 'workspace' ? selectedWorkspace : null;
  };

  const validateWorkspaceSelection = () => {
    return !(scope === 'workspace' && !selectedWorkspace);
  };

  return {
    scope,
    selectedWorkspace,
    getFinalWorkspaceIdentifier,
    validateWorkspaceSelection,
  };
};

