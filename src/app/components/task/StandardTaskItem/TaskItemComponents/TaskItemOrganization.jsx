import React from 'react';
import { Grid } from '@mui/material';
import OrganizationTile from 'components/org/OrganizationTile/OrganizationTile';
import { ListLink } from '../../styled';

const TaskItemOrganization = ({
  organizationName,
  organizationIdentifier,
  organizationInitials,
  organizationProfileColor,
}) => {
  return organizationName && organizationIdentifier ? (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <OrganizationTile
          size={30}
          organizationProfileColor={organizationProfileColor}
          organizationInitials={organizationInitials}
        />
        &nbsp;&nbsp;
        {organizationName}
      </Grid>
    </div>
  ) : (
    ''
  );
};

export default TaskItemOrganization;
