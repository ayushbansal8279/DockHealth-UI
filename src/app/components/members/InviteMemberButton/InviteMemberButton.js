import React from 'react';
import { StyledIconButton } from './styled';

const InviteMemberButton = ({ size = 54, onClick }) => {
  return (
    <>
      <div>
        <StyledIconButton size={size} onClick={onClick}>
          +
        </StyledIconButton>
      </div>
    </>
  );
};

export default InviteMemberButton;
