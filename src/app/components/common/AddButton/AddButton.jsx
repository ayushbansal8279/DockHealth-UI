import React from 'react';
import { Grid } from '@mui/material';
import { StyledAddButton } from './styled';

const AddButton = ({ onClick, children, buttonRef }) => (
  <StyledAddButton type="button" onClick={onClick} ref={buttonRef}>
    <span>+</span> {children}
  </StyledAddButton>
);

export const AddEntitiesContainer = ({ ...props }) => (
  <Grid container justifyContent="flex-end" alignItems="center" {...props} />
);

export default AddButton;
