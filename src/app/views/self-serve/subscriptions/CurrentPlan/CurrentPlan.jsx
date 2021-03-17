import { Grid, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { Fragment } from 'react';
import Loader from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import {
  themeMontserrat500,
  themeMontserrat600,
  themeMontserratNormal,
} from 'styles/theme-montserrat';
import { PlanColumnLink, PlanContainer, SwitchBillingLink } from './styled';

const AsyncElement = ({
  ErrorElement = Fragment,
  error,
  children,
  fetching,
}) => {
  if (fetching) {
    return <Loader />;
  }

  if (error) {
    return <ErrorElement />;
  }

  return children;
};

const CurrentPlan = ({
  organizationRequestError,
  isOrganizationFetching,
  subscriptionPlanData,
  showSubscriptionPlans,
}) => {
  const {
    planName,
    planSubscriptionPeriod,
    planNextPaymentLabel,
    planNextPaymentDate,
    planPricePerUser,
    planTotalPayment,
    planIsTrial,
    planIsFree,
    billingFrequency,
    planIsMonthly,
    planActiveUserCount,
  } = subscriptionPlanData || {};

  return (
    <AsyncElement
      error={organizationRequestError}
      fetching={isOrganizationFetching || !planName}
    >
      <PlanContainer>
        <Grid container direction="column">
          <ThemeProvider theme={themeMontserrat500}>
            <Typography variant="h4">Your plan</Typography>
          </ThemeProvider>
          <ThemeProvider theme={themeMontserrat600}>
            <Typography variant="h3">
              <span>{planName}</span>
              {!planIsTrial && <span> - {planPricePerUser}/user</span>}
            </Typography>
          </ThemeProvider>
          {billingFrequency && (
            <ThemeProvider theme={themeMontserratNormal}>
              <Typography variant="h4">
                <span>{planSubscriptionPeriod}</span>
                {planIsMonthly && (
                  <>
                    <Spacing horizontal={4} />
                    <SwitchBillingLink onClick={showSubscriptionPlans}>
                      Switch to annual, save 25%
                    </SwitchBillingLink>
                  </>
                )}
              </Typography>
            </ThemeProvider>
          )}
        </Grid>
        <Grid container direction="column" justify="flex-end">
          {!planIsFree && (
            <ThemeProvider theme={themeMontserratNormal}>
              <Typography variant="h6">
                {planNextPaymentLabel} {planNextPaymentDate}
              </Typography>
              <Typography variant="h6">
                <span>{planTotalPayment} </span>
                {Boolean(planActiveUserCount) && (
                  <span>({planActiveUserCount} users) </span>
                )}
                <PlanColumnLink to="/settings/billing">
                  View billing
                </PlanColumnLink>
              </Typography>
            </ThemeProvider>
          )}
        </Grid>
      </PlanContainer>
    </AsyncElement>
  );
};

export default CurrentPlan;
