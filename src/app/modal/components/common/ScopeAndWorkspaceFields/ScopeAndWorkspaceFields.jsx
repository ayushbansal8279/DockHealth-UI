import { useEffect, useState, useCallback } from 'react';
import { Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { showGlobalErrorAlert } from 'alert/actions';
import FormSelect from 'components/common/Select/FormSelect';
import { getAllUserWorkspaces } from 'api/workspace-list-api';

const ScopeAndWorkspaceFields = ({ workspaceIdentifier }) => {
  const dispatch = useDispatch();
  const { register, unregister, setValue, watch } = useFormContext();
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesLoaded, setWorkspacesLoaded] = useState(false);

  const scope =
    watch('scope') || (workspaceIdentifier ? 'workspace' : 'organization');

  useEffect(() => {
    register('scope');
    register('selectedWorkspace');

    setValue('scope', workspaceIdentifier ? 'workspace' : 'organization');
    if (workspaceIdentifier) {
      setValue('selectedWorkspace', workspaceIdentifier);
    }

    return () => {
      unregister('scope');
      unregister('selectedWorkspace');
    };
  }, []);

  const fetchWorkspaces = useCallback(async () => {
    if (workspacesLoaded) return;

    try {
      const workspaceData = await getAllUserWorkspaces();
      setWorkspaces(workspaceData);
      setWorkspacesLoaded(true);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      dispatch(showGlobalErrorAlert());
    }
  }, [workspacesLoaded, dispatch]);

  useEffect(() => {
    if (scope === 'workspace') {
      fetchWorkspaces();
      if (workspaceIdentifier) {
        setValue('selectedWorkspace', workspaceIdentifier);
      }
    } else {
      setValue('selectedWorkspace', '');
    }
  }, [scope, workspaceIdentifier, fetchWorkspaces, setValue]);

  return (
    <>
      <Grid item size={6}>
        <FormSelect
          name="scope"
          label="Scope"
          options={[
            { label: 'Organization', value: 'organization' },
            { label: 'Workspace', value: 'workspace' },
          ]}
          onChange={(newScope) => {
            if (newScope === 'organization') {
              setValue('selectedWorkspace', '');
            } else {
              fetchWorkspaces();
            }
          }}
        />
      </Grid>
      {scope === 'workspace' && (
        <Grid item size={6}>
          <FormSelect
            name="selectedWorkspace"
            label="Workspace"
            options={workspaces.map((workspace) => ({
              label: workspace.workspaceName,
              value: workspace.workspaceIdentifier,
            }))}
          />
        </Grid>
      )}
      {scope === 'organization' && <Grid item size={6} />}
    </>
  );
};

export default ScopeAndWorkspaceFields;

