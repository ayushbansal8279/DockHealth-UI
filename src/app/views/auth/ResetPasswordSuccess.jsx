import { Grid } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';

const redirectToLogin = (history) => {
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
      <Button size="large" onClick={() => redirectToLogin(history)}>
        Sign In
      </Button>
    </Grid>
  );
};
