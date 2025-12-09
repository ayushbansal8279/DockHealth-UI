import moment from 'moment';
import { Box, Grid, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isPlanTrial,
  isPlanFree,
  BillingFrequency,
  priceFormatter,
  isPlanPaid,
  getPaidPlanCancelDate,
} from 'helpers/subscription-helper';
import {
  themeMontserrat500,
  themeMontserrat600,
  themeMontserratNormal,
} from 'styles/theme-montserrat';
import { openModal } from 'modal/actions';
import { PlanColumnLink, PlanContainer } from './styled';
import {
  SubscriptionActionButton,
  SubscriptionActionContainer,
} from '../SubscriptionPlanTail/styled';
import { organizationSelector } from '@/app/selectors/organization-selectors';
import { userProfileSelector } from '@/app/selectors/user-selectors';

const CurrentPlan = ({ currentSubscriptionPlan }) => {
  const dispatch = useDispatch();
  const organization = useSelector(organizationSelector);
  const currentUser = useSelector(userProfileSelector);
  const paidPlanCancelDate = getPaidPlanCancelDate(
    currentUser,
    organization?.organizationIdentifier,
  );
  const isSubscriptionCancelled = paidPlanCancelDate;
  const isPaidSubscription = isPlanPaid(currentSubscriptionPlan);
  const {
    activeUserCount,
    activeDockLiteUserCount,
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

  const handleCancelSubscription = () => {
    dispatch(
      openModal('CancelSubscription', {
        subscriptionDetails,
        nextBillingDate,
        subscriptionPlanName,
      }),
    );
  };

  const handleResubscribe = () => {};

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
                <span>
                  {activeDockLiteUserCount > 0
                    ? `(${activeUserCount} standard user, ${activeDockLiteUserCount} Dock Lite user) `
                    : `(${activeUserCount} user) `}
                </span>
              )}
              <PlanColumnLink to="/settings/billing">
                View billing
              </PlanColumnLink>
            </Typography>
          </ThemeProvider>
        )}
      </Grid>
      {isPaidSubscription && (
        <SubscriptionActionContainer>
          <SubscriptionActionButton
            onClick={
              isSubscriptionCancelled
                ? handleResubscribe
                : handleCancelSubscription
            }
          >
            {isSubscriptionCancelled ? 'Re-subscribe' : 'Cancel Subscription'}
          </SubscriptionActionButton>
        </SubscriptionActionContainer>
      )}
    </PlanContainer>
  );
};

export default CurrentPlan;
