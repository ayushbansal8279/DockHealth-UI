import { Box, Grid } from '@mui/material';
import React from 'react';
import {
  BlueCheckbox,
  CheckboxContainer,
  AdditionalOptionLabel,
} from './styled';

const AdditionalOptions = ({ options }) => {
  return options.map(({ label, value = false, onChange, key }) => (
    <Grid container key={key}>
      <Grid item>
        <CheckboxContainer>
          <BlueCheckbox
            onClick={() => onChange(!value)}
            checked={value}
            color="secondary"
          />
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
