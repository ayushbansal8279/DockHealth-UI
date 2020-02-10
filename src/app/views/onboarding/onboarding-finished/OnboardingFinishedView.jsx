import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  getBillingDetails,
  getBillingEstimate,
} from '../../../actions/organization-actions';
import {
  OnboardingButton,
  OnboardingH2,
  OnboardingH2Bold,
  OnboardingSpacing3,
} from '../OnboardingTemplate.Components';

const goToMainPage = () => {
  hashHistory.push('/tasks');
};

const OnboardingFinishedView = () => {
  const dispatch = useDispatch();

  const organizationIdentifier = useSelector(
    store => store.userState?.userProfile?.organizationIdentifier,
  );

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 6 })(dispatch);

    getBillingDetails({ organizationIdentifier })(dispatch);
    getBillingEstimate()(dispatch);
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
          <OnboardingH2Bold>Start using Dock</OnboardingH2Bold>
        </OnboardingButton>
      </Grid>
    </div>
  );
};

export default OnboardingFinishedView;
