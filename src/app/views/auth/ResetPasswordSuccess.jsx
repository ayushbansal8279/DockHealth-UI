import { Grid } from '@material-ui/core';
import React from 'react';
import { hashHistory } from 'react-router';
import { NextButton } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'app/theme-montserrat';

const redirectToLogin = () => {
  hashHistory.push('login');
};

export default () => (
  <Grid container direction="column">
    <MontserratTypography variant="h2">
      Your password is reset
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4">
      Nice work, you’re back in action!
    </MontserratTypography>
    <Spacing vertical={5} />
    <NextButton variant="contained" onClick={redirectToLogin}>
      Sign In
    </NextButton>
  </Grid>
);
