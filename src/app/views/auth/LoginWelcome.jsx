import Grid from '@material-ui/core/Grid';
import React from 'react';
import { Link } from 'react-router';
import {
  BottomGridContainer,
  HeightDependentGrid,
  NextButton,
  Spacing2,
  Spacing4,
  StyledLabel,
  TitleTypography,
} from '../../components/auth/AuthComponents.styled';

const LoginWelcome = () => {
  return (
    <Grid container direction="column">
      <TitleTypography variant="h2" style={{ marginTop: '3em' }}>
        Welcome to Dock Health
      </TitleTypography>
      <Spacing2 />
      <TitleTypography variant="h4">
        Dock Health is a simple, HIPAA compliant platform for managing clinical
        tasks as a team. Our mission is to offer a better way <b>to&#8209;do</b>{' '}
        healthcare.
      </TitleTypography>
      <Spacing4 />
      <HeightDependentGrid size={6}>
        <NextButton
          active
          type="button"
          variant="contained"
          color="primary"
          component={Link}
          to="/onboarding"
        >
          Create an account
        </NextButton>
      </HeightDependentGrid>
      <BottomGridContainer>
        <StyledLabel bold>
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </StyledLabel>
      </BottomGridContainer>
    </Grid>
  );
};

export default LoginWelcome;
