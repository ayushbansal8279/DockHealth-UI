import { Grid } from '@mui/material';
import React from 'react';
import Spacing from 'components/common/Spacing';
import { Title, Subtitle } from 'components/auth/Title';

export default () => (
  <Grid container>
    <Grid item xs={12}>
      <Title>Reset your password</Title>
      <Spacing vertical={4} />
      <Subtitle>
        Go to your email and click on the link to reset your password.
      </Subtitle>
    </Grid>
  </Grid>
);
