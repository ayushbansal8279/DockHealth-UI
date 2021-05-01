import React from 'react';
import { StyledAddButton } from './styled';

interface AddButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, children }) => (
  <StyledAddButton type="button" onClick={onClick}>
    <span>+</span> {children}
  </StyledAddButton>
);

export default AddButton;
