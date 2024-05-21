import React from 'react';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { StyledAddButton } from './styled';
import {
  ButtonContainer,
  ButtonWrapper,
} from '../../tasklist/list-toolbar-buttons/styled';

const AddButton = ({ onClick, children, buttonRef }) => (
  <ButtonContainer>
    <ButtonWrapper variant="text" size="large" onClick={onClick}>
      <AddIcon />
      <StyledAddButton type="button" onClick={onClick} ref={buttonRef}>
        {children}
      </StyledAddButton>
    </ButtonWrapper>
  </ButtonContainer>
);

export const AddEntitiesContainer = ({ ...props }) => (
  <Grid container justifyContent="flex-end" alignItems="center" {...props} />
);

export default AddButton;
