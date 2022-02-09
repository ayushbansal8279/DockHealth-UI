import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  WORKFLOW_LIBRARY_PATH,
  createWorkflowFolderPath,
} from 'routing/helpers/paths';
import { taskTemplateBreadcrumbsSelector } from 'selectors/task-template-selectors';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Box } from '@material-ui/core';

const TemplateBreadcrumbs = () => {
  const breadcrumbs = useSelector(taskTemplateBreadcrumbsSelector);
  const history = useHistory();

  const handleRootClick = () => {
    history.push(WORKFLOW_LIBRARY_PATH);
  };

  return breadcrumbs?.length ? (
    <Box textAlign="left">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link key="root" href="/" onClick={handleRootClick}>
          Workflows
        </Link>
        {breadcrumbs.slice(0, -1).map(({ id, name }) => (
          <Link
            key={id}
            href="/"
            onClick={() => history.push(createWorkflowFolderPath(id))}
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
