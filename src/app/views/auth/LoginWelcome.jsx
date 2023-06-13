import { Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledLink } from 'components/auth/AuthComponents.styled';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import palette from 'styles/palette';

const LoginWelcome = () => (
  <Grid container direction="column">
    <MontserratTypography variant="h2" weight="bold">
      Welcome to Dock Health
    </MontserratTypography>
    <Spacing vertical={4} />
    <MontserratTypography variant="h4" weight="normal">
      Dock Health is a simple, HIPAA-compliant platform for managing clinical
      tasks as a team. Our mission is to offer a better way <b>to&#8209;do</b>{' '}
      healthcare.
    </MontserratTypography>
    <Spacing vertical={5} />
    <Button
      size="large"
      component={Link}
      to="/onboarding"
      color={palette.brightOrange}
      secondaryColor={palette.oPlusRed}
    >
      Create an account
    </Button>
    <Spacing vertical={5} />
    <MontserratTypography variant="h4">
      <span>Already have an account? </span>
      <b>
        <StyledLink to="/auth/login">SIGN IN</StyledLink>
      </b>
    </MontserratTypography>
  </Grid>
);

export default LoginWelcome;
