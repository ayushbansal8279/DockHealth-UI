import React from 'react';
import Spacing from 'components/common/Spacing';
import { MontserratTypography } from 'styles/theme-montserrat';
import OnboardingBaaSigning from '../onboarding-baa-overview/OnboardingBaaSigning';

const OnboardingBaaInvitationSentView = () => (
  <div>
    <Spacing vertical={6} />
    <MontserratTypography variant="h2" weight="600">
      Thank you, we sent an email to the authorized signer.
    </MontserratTypography>
    <Spacing vertical={5} />
    <MontserratTypography variant="h4" weight="bold">
      We need the Business Associate Agreement (BAA) signed before using Dock.
    </MontserratTypography>
    <Spacing vertical={5} />
    <MontserratTypography variant="h4">
      Once an authorized signer in your organization has signed the BAA,
      you&apos;re off to the races. Feel free to keep bothering them, we&apos;re
      sure they&apos;re busy trying to figure out how to get organized without
      us ;)
    </MontserratTypography>
    <Spacing vertical={5} />
    <OnboardingBaaSigning />
  </div>
);
export default OnboardingBaaInvitationSentView;
