import React from 'react';
import { ListLink } from '../../styled';

const TaskItemOrganization = ({
  organizationName,
  organizationIdentifier,
  organizationInitials,
  organizationProfileColor,
}) => {
  return organizationName && organizationIdentifier ? (
    <ListLink to={`/core/tasks/${organizationIdentifier}`}>
      {organizationName}
    </ListLink>
  ) : (
    'Unfiled'
  );
};

export default TaskItemOrganization;
