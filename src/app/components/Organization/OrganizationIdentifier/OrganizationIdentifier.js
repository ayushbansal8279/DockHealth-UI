import React from 'react';
import { OrganizationIdentifierContainer } from './styled';
import OrganizationTile from '../OrganizationTile/OrganizationTile';

const OrganizationIdentifier = ({
  tileConfig,
  identifierConfig,
  organizationName,
  isOpen,
}) => (
  <OrganizationIdentifierContainer {...identifierConfig}>
    <OrganizationTile {...tileConfig} />
    {isOpen && <span>{organizationName}</span>}
  </OrganizationIdentifierContainer>
);

export default OrganizationIdentifier;
