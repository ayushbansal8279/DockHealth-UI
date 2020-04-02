import { Grid } from '@material-ui/core';
import React from 'react';
import Spacing from '../../components/common/Spacing';
import { MontserratTypography } from '../../theme-montserrat';

export default () => (
  <Grid container>
    <MontserratTypography variant="h2">
      Reset your password
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4">
      Go to your email and click on the link to reset your password.
    </MontserratTypography>
  </Grid>
);
