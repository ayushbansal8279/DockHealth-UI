import React from 'react';
import { Grid } from '@material-ui/core';
import palette from 'styles/palette';
import {
  OnboardingH2Bold,
  OnboardingH3,
  OnboardingSpacing3,
  OnboardingSpacing4,
  OnboardingSpacing5,
} from 'views/onboarding/OnboardingTemplate.Components';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';

const SubscriptionExpiredView = () => {
  return (
    <ViewLayout header={<LayoutHeader />}>
      <Grid container spacing={4}>
        <Grid item sm={1} />
        <Grid item sm={8}>
          <OnboardingSpacing3 />
          <OnboardingH2Bold>
            Please notify the Owner / Admin who registered for the account.
          </OnboardingH2Bold>
          <OnboardingSpacing3 />
          <OnboardingSpacing3 />
          <OnboardingH3>
            For any questions please contact us at &nbsp;
            <a
              href="mailto:support@dock.health?Subject=Dock%20Support"
              target="_top"
              style={{ color: palette.cyanBlue }}
            >
              support@dock.health
            </a>
          </OnboardingH3>
          <OnboardingSpacing4 />
          <OnboardingSpacing5 />
        </Grid>
        <Grid item sm={3} />
      </Grid>
    </ViewLayout>
  );
};

export default SubscriptionExpiredView;
