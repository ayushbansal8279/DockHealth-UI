import { Box, Grid } from '@material-ui/core';
import React from 'react';
import {
  BlueCheckbox,
  CheckboxContainer,
  AdditionalOptionLabel,
} from './styled';

const AdditionalOptions = ({ options }) => {
  return options.map(({ label, value = false, onChange, key }) => (
    <Grid container onClick={() => onChange(true)} key={key}>
      <Grid item>
        <CheckboxContainer>
          <BlueCheckbox checked={value} color="secondary" />
        </CheckboxContainer>
      </Grid>
      <Grid item xs={6}>
        <Box alignItems="center" display="flex" height="100%">
          <AdditionalOptionLabel>{label}</AdditionalOptionLabel>
        </Box>
      </Grid>
    </Grid>
  ));
};

export default AdditionalOptions;
