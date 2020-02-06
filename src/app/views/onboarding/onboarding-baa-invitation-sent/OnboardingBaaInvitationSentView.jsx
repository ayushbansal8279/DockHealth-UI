import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';

const goToMainPage = () => {
  hashHistory.push('/');
};

const OnboardingBaaInvitationSentView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  return (
    <>
      <OnboardingH1Bold>INVITATION SENT!</OnboardingH1Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>
        Wait for the Authorized Signer to sign the BAA for your organization.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <Grid container justify="flex-end">
        <OnboardingButton variant="contained" onClick={goToMainPage}>
          <OnboardingH2Bold> Go to the main page</OnboardingH2Bold>
        </OnboardingButton>
      </Grid>
    </>
  );
};

export default OnboardingBaaInvitationSentView;
