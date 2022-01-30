import React from 'react';
import { StyledAddButton } from './styled';

interface AddButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  buttonRef: any;
}

const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  children,
  buttonRef,
}) => (
  <StyledAddButton type="button" onClick={onClick} ref={buttonRef}>
    <span>+</span> {children}
  </StyledAddButton>
);

export default AddButton;
