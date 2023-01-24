import React from 'react';
import { AvatarWrapper, AvatarInitials } from './styled';

const OrganizationAvatar = ({ initials, size = 75, backgroundColor }) => (
  <AvatarWrapper size={size} backgroundColor={backgroundColor}>
    <AvatarInitials size={size}>{initials}</AvatarInitials>
  </AvatarWrapper>
);

export default OrganizationAvatar;
