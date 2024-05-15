import React from 'react';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme-outfit';
import OnboardingBaaSigning from '../OnboardingBaaOverviewView/OnboardingBaaSigning';

const OnboardingBaaInvitationSentView = () => (
  <div>
    <Spacing vertical={6} />
    <OutfitTypography variant="h2" weight="600">
      Thank you, we sent an email to the authorized signer.
    </OutfitTypography>
    <Spacing vertical={5} />
    <OutfitTypography variant="h4" weight="bold">
      We need the Business Associate Agreement (BAA) signed before using Dock.
    </OutfitTypography>
    <Spacing vertical={5} />
    <OutfitTypography variant="h4">
      Once an authorized signer in your organization has signed the BAA,
      you&apos;re off to the races. Feel free to keep bothering them, we&apos;re
      sure they&apos;re busy trying to figure out how to get organized without
      us ;)
    </OutfitTypography>
    <Spacing vertical={5} />
    <OnboardingBaaSigning />
  </div>
);
export default OnboardingBaaInvitationSentView;
