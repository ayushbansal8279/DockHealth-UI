import React from 'react';
import Spacing from 'components/common/Spacing';
import { OutfitTypography } from 'styles/theme-outfit';
import OnboardingBaaSigning from './OnboardingBaaSigning';

const OnboardingBaaOverviewView = () => {
  return (
    <div>
      <Spacing vertical={6} />
      <OutfitTypography variant="h2" weight="600">
        NOW FOR SOMETHING COMPLETELY SERIOUS.
      </OutfitTypography>
      <Spacing vertical={5} />
      <OutfitTypography variant="h3">
        Next, the Business Associate Agreement
      </OutfitTypography>
      <Spacing vertical={5} />
      <OutfitTypography variant="h3" weight="bold">
        What is a Business Associate Agreement (BAA)?
      </OutfitTypography>
      <Spacing vertical={4} />
      <OutfitTypography variant="h4">
        A BAA is essential to HIPAA compliance and ensures that there is a
        legally binding contract between Dock Health and your organization to
        securely and safely manage Protected Health Information (PHI).
      </OutfitTypography>
      <Spacing vertical={5} />
      <OutfitTypography variant="h4">
        With this in place, it is safe to use the Dock Health platform for
        patient information provided you and your organization appropriately
        manage access to this data.
      </OutfitTypography>
      <Spacing vertical={5} />
      <OutfitTypography variant="h3" weight="bold">
        Who should sign?
      </OutfitTypography>
      <Spacing vertical={4} />
      <OutfitTypography variant="h4">
        To ensure HIPAA compliance, an officer of your organization with legal
        right to enter into a HIPAA Business Associate Agreement should be the
        one to sign. If you have someone without sufficient authority sign the
        agreement (an office administrator, for instance), then it&apos;s
        possible you&apos;re failing to properly meet your obligations under
        HIPAA.
      </OutfitTypography>
      <Spacing vertical={6} />
      <OnboardingBaaSigning mainDisplayOption />
    </div>
  );
};

export default OnboardingBaaOverviewView;
