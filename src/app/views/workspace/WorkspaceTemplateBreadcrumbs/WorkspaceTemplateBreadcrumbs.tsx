import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createWorkflowFolderPath } from '@/app/routing/helpers/paths';
import { taskTemplateBreadcrumbsSelector } from '@/app/selectors/task-template-selectors';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box } from '@mui/material';
import { workspaceSelector } from '@/app/selectors/workspace-selectors';

const WorkspaceTemplateBreadcrumbs = () => {
  const breadcrumbs = useSelector(taskTemplateBreadcrumbsSelector);
  const workspace = useSelector(workspaceSelector);
  const workspaceIdentifier = workspace.workspaceIdentifier;

  const breadcrumbsPath = useMemo(() => {
    return `/core/workspace/${workspaceIdentifier}/workflowLibrary`;
  }, [workspaceIdentifier]);

  return breadcrumbs?.length ? (
    <Box textAlign="left">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link to={breadcrumbsPath}>Workflows</Link>
        {breadcrumbs.slice(0, -1).map(({ id, name }) => (
          <Link key={id} to={createWorkflowFolderPath(id)}>
            {name}
          </Link>
        ))}
        <Typography color="textPrimary">
          {breadcrumbs[breadcrumbs.length - 1]?.name}
        </Typography>
      </Breadcrumbs>
    </Box>
  ) : null;
};

export default WorkspaceTemplateBreadcrumbs;
