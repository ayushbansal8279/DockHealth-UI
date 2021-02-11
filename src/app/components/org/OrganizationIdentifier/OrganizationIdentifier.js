import React from 'react';
import { OrganizationIdentifierContainer } from './styled';
import OrganizationTile from '../OrganizationTile/OrganizationTile';

const OrganizationIdentifier = ({
  tileConfig,
  identifierConfig,
  organizationName,
  isOpen,
  onSelect = () => {},
  onMouseEnterName = () => {},
  onMouseLeaveName = () => {},
}) => (
  <OrganizationIdentifierContainer {...identifierConfig} onClick={onSelect}>
    <OrganizationTile {...tileConfig} />
    {isOpen && (
      <span onMouseEnter={onMouseEnterName} onMouseLeave={onMouseLeaveName}>
        {organizationName}
      </span>
    )}
  </OrganizationIdentifierContainer>
);

export default OrganizationIdentifier;
