import React from 'react';

import { OrganizationTileContaier } from './styled';

const OrganizationTile = ({
  organizationProfileColor,
  organizationInitials,
  size = 43,
}) => {
  return (
    <OrganizationTileContaier
      organizationColor={organizationProfileColor}
      size={size}
      isDefaultTile={!organizationInitials}
    >
      {organizationInitials || ''}
    </OrganizationTileContaier>
  );
};

export default OrganizationTile;
