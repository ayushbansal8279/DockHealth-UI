import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useDispatch } from 'react-redux';
import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import useBoolean from '../../../hooks/useBoolean';
import {
  OnboardingButton,
  OnboardingH1Bold,
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingH3Bold,
  OnboardingHorizontalSpacing3,
  OnboardingSpacing2,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';
import InvitationForm from './OnboardingBaaOverviewView.InvitationForm';

const goToBaaSigning = () => {
  hashHistory.push('/onboarding/baa-signing');
};

const goToTeamOrgSetup = () => {
  hashHistory.push('/onboarding/team-org-setup');
};

const OnboardingBaaOverviewView = () => {
  const dispatch = useDispatch();
  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  const [
    isInvitationFormShown,
    showInvitationForm,
    hideInvitationForm,
  ] = useBoolean(false);

  return (
    <div>
      <OnboardingH1Bold>THAT WAS EASY</OnboardingH1Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>Next, the Business Associate Agreement...</OnboardingH3>
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
      <OnboardingSpacing4 />
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
      {!isInvitationFormShown && (
        <>
          <OnboardingH3Bold>Are you an authorized signer?</OnboardingH3Bold>
          <OnboardingSpacing5 />
          <Grid container>
            <OnboardingButton
              onClick={showInvitationForm}
              variant="contained"
              size="narrow"
            >
              <OnboardingH2Bold>No</OnboardingH2Bold>
            </OnboardingButton>
            <OnboardingHorizontalSpacing3 />
            <OnboardingButton
              onClick={goToBaaSigning}
              variant="contained"
              size="narrow"
            >
              <OnboardingH2Bold>Yes</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
          <OnboardingSpacing3 />
          <Grid container>
            <OnboardingButton
              onClick={goToTeamOrgSetup}
              variant="outlinedError"
              size="narrow"
            >
              <OnboardingH2Bold>Skip</OnboardingH2Bold>
            </OnboardingButton>
          </Grid>
        </>
      )}
      {isInvitationFormShown && (
        <InvitationForm hideInvitationForm={hideInvitationForm} />
      )}
    </div>
  );
};

export default OnboardingBaaOverviewView;
