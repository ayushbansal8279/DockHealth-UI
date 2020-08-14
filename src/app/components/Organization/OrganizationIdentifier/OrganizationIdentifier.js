import React from 'react';
import { OrganizationIdentifierContainer } from './styled';
import OrganizationTile from '../OrganizationTile/OrganizationTile';

const OrganizationIdentifier = ({
  tileConfig,
  spacingsConfig,
  organizationName,
  isOpen,
}) => (
  <OrganizationIdentifierContainer {...spacingsConfig}>
    <OrganizationTile {...tileConfig} />
    {isOpen && <span>{organizationName}</span>}
  </OrganizationIdentifierContainer>
);

export default OrganizationIdentifier;
