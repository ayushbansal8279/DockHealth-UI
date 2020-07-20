import React, { FunctionComponent } from 'react';
import styled, { StyledComponent } from 'styled-components';

interface ButtonProps {
  variant: 'contained' | 'outlined' | 'text';
}

const StyledButton: StyledComponent<
  'button',
  any,
  ButtonProps,
  never
> = styled.button``;

const DockButton: FunctionComponent<ButtonProps> = ({
  children,
  variant = 'contained',
}) => {
  return <StyledButton variant={variant}>{children}</StyledButton>;
};

export default DockButton;
