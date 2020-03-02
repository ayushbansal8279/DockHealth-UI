import Grid from '@material-ui/core/Grid';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
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
  const isSmallScreen = useMediaQuery('(max-width: 960px)');

  return (
    <Grid container direction="column">
      <Grid item sm={12} md={6}>
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
