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
      Your password is reset
    </TitleTypography>
    <Grid item sm={12} md={9}>
      <TitleTypography variant="h4">Nice work, you’re back in action!</TitleTypography>
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
        Sign In
      </NextButton>
    </Grid>
  </Grid>
);
