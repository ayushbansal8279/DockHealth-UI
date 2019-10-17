import Grid from '@material-ui/core/Grid';
import React from 'react';
import { hashHistory } from 'react-router';

import { NextButton, TitleTypography } from '../../components/auth/AuthComponents.styled';

const redirectToLogin = () => {
  hashHistory.push('login');
};

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
    <Grid item sm={12} md={6}>
      <NextButton
        active
        id="loginButton"
        variant="contained"
        color="primary"
        style={{
          marginTop: '5rem',
        }}
        onClick={redirectToLogin}
      >
        Go back
      </NextButton>
    </Grid>
  </Grid>
);
