import { Box, Grid } from '@mui/material';
import React from 'react';
import {
  BlueCheckbox,
  CheckboxContainer,
  AdditionalOptionLabel,
} from './styled';

const AdditionalOptions = ({ options }) => {
  return options.map(({ label, value = false, onChange, key }) => (
    <Grid container onClick={() => onChange(!value)} key={key}>
      <Grid item>
        <CheckboxContainer>
          <BlueCheckbox checked={value} color="secondary" />
        </CheckboxContainer>
      </Grid>
      <Grid item size={6}>
        <Box alignItems="center" display="flex" height="100%">
          <AdditionalOptionLabel>{label}</AdditionalOptionLabel>
        </Box>
      </Grid>
    </Grid>
  ));
};

export default AdditionalOptions;
