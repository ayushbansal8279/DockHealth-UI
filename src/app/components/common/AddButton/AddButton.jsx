import React from 'react';
import { Box } from '@mui/material';
import { StyledAddButton } from './styled';

const AddButton = ({ onClick, children, buttonRef }) => (
  <StyledAddButton type="button" onClick={onClick} ref={buttonRef}>
    <span>+</span> {children}
  </StyledAddButton>
);

export const AddEntitiesContainer = ({ ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
    }}
    {...props}
  />
);

export default AddButton;
