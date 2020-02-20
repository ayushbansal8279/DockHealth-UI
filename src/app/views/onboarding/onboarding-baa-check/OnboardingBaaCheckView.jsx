import React from 'react';
import { useDispatch } from 'react-redux';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from '../OnboardingTemplate.Components';
import OnboardingBaaSigning from '../onboarding-baa-overview/OnboardingBaaSigning';

const OnboardingBaaCheckView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  return (
    <div>
      <OnboardingH2Bold>
        Thank You! We need the Business Associate Agreement (BAA) signed before
        using Dock.
      </OnboardingH2Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>
        In order to be HIPAA compliant and rock your world, we will first need
        the Business Associate Agreement (BAA) signed. Once an authorized signer
        in your organization has signed the BAA, you&apos;re off to the races.
        Feel free to keep bothering them, we&apos;re sure they&apos;re busy
        trying to figure out how to get organized without us ;)
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingSpacing5 />
      <OnboardingBaaSigning />
    </div>
  );
};

export default OnboardingBaaCheckView;
