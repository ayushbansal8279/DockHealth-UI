import React from 'react';

import { OrganizationTileContaier } from './styled';

const OrganizationTile = ({
  organizationColor,
  organizationInitial,
  size = 43,
}) => {
  return (
    <OrganizationTileContaier
      organizationColor={organizationColor}
      size={size}
      isDefaultTile={!organizationInitial}
    >
      {organizationInitial || 'ABC'}
    </OrganizationTileContaier>
  );
};

export default OrganizationTile;
