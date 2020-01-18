import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingButton,
  OnboardingH2,
  OnboardingSpacing3,
} from '../OnboardingTemplate.Components';

const goToMainPage = () => {
  hashHistory.push('/');
};

const OnboardingFinishedView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 6 })(dispatch);
  });

  return (
    <div>
      <OnboardingH2>All done!</OnboardingH2>
      <OnboardingSpacing3 />
      <OnboardingH2>
        You can now start using <b>Dock</b>
      </OnboardingH2>
      <OnboardingSpacing3 />
      <Grid container justify="flex-end">
        <OnboardingButton variant="contained" onClick={goToMainPage}>
          <OnboardingH2>Start using Dock</OnboardingH2>
        </OnboardingButton>
      </Grid>
    </div>
  );
};

export default OnboardingFinishedView;
