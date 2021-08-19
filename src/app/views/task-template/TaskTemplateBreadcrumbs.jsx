import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { taskTemplateBreadcrumbsSelector } from 'selectors/task-template-selectors';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const BreadcrumbContainer = styled.div`
  text-align: left;
`;

const TemplateBreadcumbs = ({ onRootClick, onChildClick }) => {
  const breadcrumbs = useSelector(taskTemplateBreadcrumbsSelector);
  const handleChildClick = useCallback(
    (index, breadcrumb, event) => {
      event.preventDefault();
      if (typeof onChildClick === 'function') {
        onChildClick(breadcrumbs.slice(0, index + 1), breadcrumb, event);
      }
    },
    [breadcrumbs, onChildClick],
  );
  const handleRootClick = useCallback(
    event => {
      event.preventDefault();
      if (typeof onRootClick === 'function') {
        onRootClick(event);
      }
    },
    [onRootClick],
  );
  // eslint-disable-next-line unicorn/explicit-length-check
  return breadcrumbs?.length ? (
    <BreadcrumbContainer>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link key="root" href="/" onClick={event => handleRootClick(event)}>
          Workflows
        </Link>
        {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
          <Link
            key={breadcrumb.taskTemplateFolderIdentifier}
            href="/"
            onClick={event => handleChildClick(index, breadcrumb, event)}
          >
            {breadcrumb.name}
          </Link>
        ))}
        <Typography color="textPrimary">
          {breadcrumbs[breadcrumbs.length - 1]?.name}
        </Typography>
      </Breadcrumbs>
    </BreadcrumbContainer>
  ) : null;
};

export default TemplateBreadcumbs;
