import { Grid } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { NextButton } from 'components/auth/AuthComponents.styled';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';

const redirectToLogin = history => {
  history.push('login');
};

export default () => {
  const history = useHistory();
  return (
    <Grid container direction="column">
      <MontserratTypography variant="h2">
        Your password is reset
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4">
        Nice work, you’re back in action!
      </MontserratTypography>
      <Spacing vertical={5} />
      <NextButton variant="contained" onClick={() => redirectToLogin(history)}>
        Sign In
      </NextButton>
    </Grid>
  );
};
