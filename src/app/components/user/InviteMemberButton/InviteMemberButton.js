import React from 'react';
import { StyledIconButton } from './styled';

const InviteMemberButton = ({ size = 54, onClick }) => {
  return (
    <StyledIconButton size={size} onClick={onClick}>
      +
    </StyledIconButton>
  );
};

export default InviteMemberButton;
