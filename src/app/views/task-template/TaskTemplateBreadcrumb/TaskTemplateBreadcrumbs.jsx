import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  WORKFLOW_LIBRARY_PATH,
  createWorkflowFolderPath,
  WORKSPACE_PATH,
  createWorkflowFolderPathForWorkspace,
} from 'routing/helpers/paths';
import { taskTemplateBreadcrumbsSelector } from 'selectors/task-template-selectors';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box } from '@mui/material';

const TemplateBreadcrumbs = ({ workspaceIdentifier }) => {
  const breadcrumbs = useSelector(taskTemplateBreadcrumbsSelector);
  const workspacePath = `${WORKSPACE_PATH}/${workspaceIdentifier}/workflowLibrary`;

  return breadcrumbs?.length ? (
    <Box textAlign="left">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link to={workspaceIdentifier ? workspacePath : WORKFLOW_LIBRARY_PATH}>
          Workflows
        </Link>
        {breadcrumbs.slice(0, -1).map(({ id, name }) => (
          <Link
            key={id}
            to={
              workspaceIdentifier
                ? createWorkflowFolderPathForWorkspace(workspaceIdentifier, id)
                : createWorkflowFolderPath(id)
            }
          >
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

export default TemplateBreadcrumbs;
