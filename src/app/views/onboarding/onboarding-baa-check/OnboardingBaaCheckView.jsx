import React from 'react';
import Spacing from '../../../components/common/Spacing';
import { MontserratTypography } from '../../../theme-montserrat';
import OnboardingBaaSigning from '../onboarding-baa-overview/OnboardingBaaSigning';

const OnboardingBaaCheckView = () => (
  <div>
    <Spacing vertical={6} />
    <MontserratTypography variant="h2" weight="600">
      Thank you! We need the Business Associate Agreement (BAA) signed before
      using Dock.
    </MontserratTypography>
    <Spacing vertical={5} />
    <MontserratTypography variant="h4">
      In order to be HIPAA compliant and rock your world, we will first need the
      Business Associate Agreement (BAA) signed. Once an authorized signer in
      your organization has signed the BAA, you&apos;re off to the races. Feel
      free to keep bothering them, we&apos;re sure they&apos;re busy trying to
      figure out how to get organized without us ;)
    </MontserratTypography>
    <Spacing vertical={5} />
    <OnboardingBaaSigning />
  </div>
);
export default OnboardingBaaCheckView;
