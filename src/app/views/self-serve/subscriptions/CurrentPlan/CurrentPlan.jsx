import moment from 'moment';
import { Box, Grid, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {
  isPlanTrial,
  isPlanFree,
  BillingFrequency,
  priceFormatter,
} from 'helpers/subscription-helper';
import {
  themeMontserrat500,
  themeMontserrat600,
  themeMontserratNormal,
} from 'styles/theme-montserrat';
import { PlanColumnLink, PlanContainer } from './styled';

const CurrentPlan = ({ currentSubscriptionPlan }) => {
  const {
    activeUserCount,
    annualEstimate,
    monthlyEstimate,
    subscriptionDetails,
    monthlyPerUserCost,
    nextBillingDate,
  } = currentSubscriptionPlan;

  const {
    subscriptionPlanName,
    billingFrequency,
    professionalServicesIncluded,
    trialEndDate,
  } = subscriptionDetails || {};

  return (
    <PlanContainer>
      <Grid container direction="column">
        <ThemeProvider theme={themeMontserrat500}>
          <Typography variant="h4">Your plan</Typography>
        </ThemeProvider>
        <ThemeProvider theme={themeMontserrat600}>
          <Typography variant="h3">
            <span>{subscriptionPlanName}</span>
            {!isPlanTrial(subscriptionDetails) && (
              <span> - {priceFormatter(monthlyPerUserCost)}/user</span>
            )}
          </Typography>
        </ThemeProvider>
        {billingFrequency && (
          <ThemeProvider theme={themeMontserratNormal}>
            <Typography variant="h4">
              {billingFrequency === BillingFrequency.MONTHLY
                ? 'Monthly Billing'
                : 'Annual Billing'}
            </Typography>
          </ThemeProvider>
        )}
        {professionalServicesIncluded && (
          <ThemeProvider theme={themeMontserratNormal}>
            <Box m={0.2} />
            <Typography variant="h5">Professional services included</Typography>
          </ThemeProvider>
        )}
      </Grid>
      <Grid container direction="column" justifyContent="flex-end">
        {!isPlanFree(subscriptionDetails) && (
          <ThemeProvider theme={themeMontserratNormal}>
            <Typography variant="h6">
              {isPlanTrial(subscriptionDetails) ? (
                <>
                  <span>Your trial period</span>
                  {trialEndDate && (
                    <span> ends on {moment(trialEndDate).format('L')}</span>
                  )}
                </>
              ) : (
                <>
                  <span>Your next payment</span>
                  {nextBillingDate && (
                    <span>
                      {' '}
                      charged on {moment(nextBillingDate).format('L')}
                    </span>
                  )}
                </>
              )}
            </Typography>
            <Typography variant="h6">
              <span>
                {priceFormatter(
                  billingFrequency === BillingFrequency.ANNUAL
                    ? annualEstimate
                    : monthlyEstimate,
                )}
              </span>
              {Boolean(activeUserCount) && (
                <span>({activeUserCount} users) </span>
              )}
              <PlanColumnLink to="/settings/billing">
                View billing
              </PlanColumnLink>
            </Typography>
          </ThemeProvider>
        )}
      </Grid>
    </PlanContainer>
  );
};

export default CurrentPlan;
