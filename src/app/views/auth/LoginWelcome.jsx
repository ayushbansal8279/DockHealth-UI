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
import { useSmallScreen } from '../../helpers/utility-functions';

const LoginWelcome = () => {
  const isSmallScreen = useSmallScreen();

  return (
    <Grid container direction="column">
      <Grid item xs={12} sm={12} md={6}>
        <TitleTypography
          variant="h2"
          isSmallScreen={isSmallScreen}
          style={{ marginTop: isSmallScreen ? '1em' : '3em' }}
        >
          Welcome to Dock Health
        </TitleTypography>
        <Spacing2 />
        <TitleTypography variant="h4">
          Dock Health is a simple, HIPAA compliant platform for managing
          clinical tasks as a team. Our mission is to offer a better way{' '}
          <b>to&#8209;do</b> healthcare.
        </TitleTypography>
        <Spacing4 />
        <HeightDependentGrid size={isSmallScreen ? 12 : 6}>
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
        {isSmallScreen && <Spacing4 />}
        <BottomGridContainer>
          <StyledLabel bold remFontSize={isSmallScreen && 1.5}>
            <span>Already have an account? </span>
            <Link to="/login">Login</Link>
          </StyledLabel>
        </BottomGridContainer>
      </Grid>
    </Grid>
  );
};

export default LoginWelcome;
