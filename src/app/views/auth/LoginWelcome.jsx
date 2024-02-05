import { Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledLink } from 'components/auth/AuthComponents.styled';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme-outfit';
import palette from 'styles/palette';
import { Title, Subtitle } from 'components/auth/Title';

const LoginWelcome = () => (
  <Grid container direction="column">
    <Title>Welcome to Dock Health</Title>
    <Spacing vertical={4} />
    <Subtitle>
      Dock Health is a simple, HIPAA-compliant platform for managing clinical
      tasks as a team. Our mission is to offer a better way <b>to&#8209;do</b>{' '}
      healthcare.
    </Subtitle>
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
    <OutfitTypography variant="h4">
      <span>Already have an account? </span>
      <b>
        <StyledLink to="/auth/login">SIGN IN</StyledLink>
      </b>
    </OutfitTypography>
  </Grid>
);

export default LoginWelcome;
