import { Grid } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { Subtitle, Title } from 'components/auth/Title';

const redirectToLogin = (history) => {
  history.push('login');
};

export default () => {
  const history = useHistory();
  return (
    <Grid container direction="column">
      <Title>Your password is reset</Title>
      <Spacing vertical={4} />
      <Subtitle>Nice work, you’re back in action!</Subtitle>
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
