import React from 'react';
import { StyledAddButton } from './styled';

const AddButton = ({ onClick, children, buttonRef }) => (
  <StyledAddButton type="button" onClick={onClick} ref={buttonRef}>
    <span>+</span> {children}
  </StyledAddButton>
);

export default AddButton;
