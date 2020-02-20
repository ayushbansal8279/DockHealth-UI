import React from 'react';
import { useDispatch } from 'react-redux';
// import { hashHistory } from 'react-router';
import { useMount } from 'react-use';
import { setOnboardingCurrentStep } from '../../../actions/onboarding-progress-actions';
import {
  OnboardingH2Bold,
  OnboardingH3Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
} from '../OnboardingTemplate.Components';
import OnboardingBaaSigning from '../onboarding-baa-overview/OnboardingBaaSigning';

// const goToMainPage = () => {
//   hashHistory.push('/');
// };

const OnboardingBaaInvitationSentView = () => {
  const dispatch = useDispatch();

  useMount(() => {
    setOnboardingCurrentStep({ currentStep: 3 })(dispatch);
  });

  return (
    <>
      <OnboardingH2Bold>
        Thank you, we sent an email to the authorized signer.
      </OnboardingH2Bold>
      <OnboardingSpacing3 />
      <OnboardingH3Bold>
        We need the Business Associate Agreement (BAA) signed before using Dock.
      </OnboardingH3Bold>
      <OnboardingSpacing3 />
      <OnboardingH3>
        Once an authorized signer in your organization has signed the BAA,
        you&apos;re off to the races. Feel free to keep bothering them,
        we&apos;re sure they&apos;re busy trying to figure out how to get
        organized without us ;)
      </OnboardingH3>
      <OnboardingSpacing4 />
      <OnboardingBaaSigning />
    </>
  );
};

export default OnboardingBaaInvitationSentView;
