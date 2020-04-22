import { Grid } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router';
import { NextButton, StyledLink } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';

const LoginWelcome = () => (
  <Grid container direction="column">
    <MontserratTypography variant="h2">
      Welcome to Dock Health
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4">
      Dock Health is a simple, HIPAA compliant platform for managing clinical
      tasks as a team. Our mission is to offer a better way <b>to&#8209;do</b>{' '}
      healthcare.
    </MontserratTypography>
    <Spacing vertical={5} />
    <NextButton
      type="button"
      variant="contained"
      color="primary"
      component={Link}
      to="/onboarding"
    >
      Create an account
    </NextButton>
    <Spacing vertical={5} />
    <MontserratTypography variant="h4">
      <span>Already have an account? </span>
      <StyledLink to="/login">SIGN IN</StyledLink>
    </MontserratTypography>
  </Grid>
);

export default LoginWelcome;
