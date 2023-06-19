import { Grid } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import palette from 'styles/palette';

const redirectToLogin = (history) => {
  history.push('login');
};

export default () => {
  const history = useHistory();
  return (
    <Grid container direction="column">
      <MontserratTypography variant="h2" weight="bold" align="center">
        Your password is reset
      </MontserratTypography>
      <Spacing vertical={4} />
      <MontserratTypography variant="h4" align="center">
        Nice work, you’re back in action!
      </MontserratTypography>
      <Spacing vertical={5} />
      <Button
        size="large"
        onClick={() => redirectToLogin(history)}
        color={palette.brightOrange}
        secondaryColor={palette.oPlusRed}
      >
        Sign In
      </Button>
    </Grid>
  );
};
