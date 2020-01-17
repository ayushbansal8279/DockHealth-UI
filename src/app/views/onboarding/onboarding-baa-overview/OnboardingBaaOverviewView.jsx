import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';

import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingButton,
  OnboardingH2,
  OnboardingH3,
  OnboardingH3Bold,
  OnboardingHorizontalSpacing3,
  OnboardingSpacing2,
  OnboardingSpacing3,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';

const OnboardingBaaOverviewView = () => {
  const dispatch = useDispatch();
  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  return (
    <div>
      <OnboardingH3>Great! That was easy.</OnboardingH3>
      <OnboardingSpacing3 />
      <OnboardingH3>Next, the BAA...</OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3Bold>
        What is a Business Associate Agreement (BAA)?
      </OnboardingH3Bold>
      <OnboardingSpacing2 />
      <OnboardingH3>
        A BAA is essential to HIPAA compliance and ensures that there is a
        legally binding contract between Dock Health and your organization to
        securely and safely manage Protected Health Information (PHI).
      </OnboardingH3>
      <OnboardingSpacing2 />
      <OnboardingH3>
        With this in place, it is safe to use the Dock Health platform for
        patient information provided you and your organization appropriately
        manage access to this data.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3Bold>Authorized Signer</OnboardingH3Bold>
      <OnboardingSpacing2 />
      <OnboardingH3>
        An authorized signer is a person with authority to enter into,
        administer, and/or terminate contracts and make related determinations
        and findings on behalf of an organization or practice. Typically this
        might include a CEO, owner, privacy officer, or administrator given such
        rights.
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3Bold>Are you an authorized signer?</OnboardingH3Bold>
      <OnboardingSpacing4 />
      <Grid container>
        <OnboardingButton variant="containedAutoWidth">
          <OnboardingH2>No</OnboardingH2>
        </OnboardingButton>
        <OnboardingHorizontalSpacing3 />
        <OnboardingButton variant="containedAutoWidth">
          <OnboardingH2>Yes</OnboardingH2>
        </OnboardingButton>
      </Grid>
    </div>
  );
};

export default OnboardingBaaOverviewView;
