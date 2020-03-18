import { Grid } from '@material-ui/core';
import React from 'react';
import { TitleTypography } from '../../components/auth/AuthComponents.styled';

export default () => (
  <Grid container>
    <TitleTypography variant="h2" style={{ marginTop: '6em' }}>
      Reset your password
    </TitleTypography>
    <Grid item sm={12} md={10}>
      <TitleTypography variant="h4">
        Go to your email and click on the link to reset your password.
      </TitleTypography>
    </Grid>
  </Grid>
);
