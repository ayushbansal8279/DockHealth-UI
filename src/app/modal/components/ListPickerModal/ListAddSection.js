import React from 'react';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import { Title, Description, StyledButton } from './styled';

const ListAddSection = ({ listName, onCancel }) => {
  return (
    <>
      <Title>Create new list</Title>
      <Description>Name your new list and move your task</Description>
      <Spacing vertical={4} />
      {listName}
      <Spacing vertical={4} />
      <Grid container direction="row" spacing={2}>
        <Grid item xs={6}>
          <StyledButton
            variant="outlined"
            type="button"
            size="small"
            onClick={onCancel}
          >
            Cancel
          </StyledButton>
        </Grid>
        <Grid item xs={6}>
          <StyledButton
            variant="contained"
            type="button"
            size="small"
            onClick={() => {}}
          >
            Save
          </StyledButton>
        </Grid>
      </Grid>
    </>
  );
};

export default ListAddSection;
