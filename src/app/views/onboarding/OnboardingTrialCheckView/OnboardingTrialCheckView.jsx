import { Grid } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import palette from 'styles/palette';
import Button from 'components/common/Button/Button';
import {
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';

const subscribeNow = history => {
  history.push('subscriptions');
};

const OnboardingTrialCheckView = () => {
  const history = useHistory();
  return (
    <div>
      <OnboardingH2Bold>Your free trial period has expired.</OnboardingH2Bold>
      <OnboardingSpacing3 />
      <Grid container justify="flex-start">
        <Button onClick={() => subscribeNow(history)}>
          <OnboardingH2Bold>Subscribe Now</OnboardingH2Bold>
        </Button>
      </Grid>
      <OnboardingSpacing3 />
      <OnboardingSpacing3 />
      <OnboardingH3>
        For any questions please contact us at &nbsp;
        <a
          href="mailto:support@dock.health?Subject=Dock%20Support"
          target="_top"
          style={{ color: palette.cyanBlue }}
        >
          support@dock.health
        </a>
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingSpacing5 />
    </div>
  );
};

export default OnboardingTrialCheckView;
