import React from 'react';
import palette from 'styles/palette';
import { AvatarWrapper, AvatarInitials } from './styled';

const OrganizationAvatar = ({
  initials,
  size = 75,
  backgroundColor = palette.coolGrey4,
}) => (
  <AvatarWrapper size={size} backgroundColor={backgroundColor}>
    <AvatarInitials size={size}>{initials}</AvatarInitials>
  </AvatarWrapper>
);

export default OrganizationAvatar;
