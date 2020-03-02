import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingH1Bold,
  OnboardingH3,
  OnboardingH3Bold,
  OnboardingSpacing1,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
  OnboardingSmallScreenLogo,
} from '../OnboardingTemplate.Components';
import OnboardingBaaSigning from './OnboardingBaaSigning';
import { useSmallScreen } from '../../../helpers/utility-functions';

const OnboardingBaaOverviewView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  const isSmallScreen = useSmallScreen();

  return (
    <div>
      {isSmallScreen && <OnboardingSmallScreenLogo />}
      <OnboardingH1Bold>THAT WAS EASY</OnboardingH1Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>Next, the Business Associate Agreement</OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingH3Bold>
        What is a Business Associate Agreement (BAA)?
      </OnboardingH3Bold>
      <OnboardingSpacing1 />
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
      <OnboardingH3Bold>Who should sign?</OnboardingH3Bold>
      <OnboardingSpacing1 />
      <OnboardingH3>
        To ensure HIPAA compliance, an officer of your organization with legal
        right to enter into a HIPAA Business Associate Agreement should be the
        one to sign. If you have someone without sufficient authority sign the
        agreement (an office administrator, for instance), then it&apos;s
        possible you&apos;re failing to properly meet your obligations under
        HIPAA.
      </OnboardingH3>
      <OnboardingSpacing5 />
      <OnboardingBaaSigning mainDisplayOption />
    </div>
  );
};

export default OnboardingBaaOverviewView;
