import { Grid } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from 'actions/onboarding-progress-actions';
import palette from 'styles/palette';
import {
  OnboardingButton,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';

const subscribeNow = () => {
  hashHistory.push('subscriptions');
};

const OnboardingTrialCheckView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 1 })(dispatch);
  });

  return (
    <div>
      <OnboardingH2Bold>Your free trial period has expired.</OnboardingH2Bold>
      <OnboardingSpacing3 />
      <Grid container justify="flex-start">
        <OnboardingButton
          type="button"
          variant="contained"
          onClick={subscribeNow}
        >
          <OnboardingH2Bold>Subscribe Now</OnboardingH2Bold>
        </OnboardingButton>
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
