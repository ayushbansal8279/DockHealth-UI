import { Grid, Hidden } from '@material-ui/core';
import React, { Fragment } from 'react';
import CubesLoader from '../../../components/common/CubesLoader';
import {
  CurrentPlanDivider,
  PlanColumnLink,
  PlanContainer,
  PlanNameLabel,
} from './SubscriptionsView.CurrentPlan.Styled';
import {
  BigPriceLabel,
  H1Bold,
  H3Marginless,
  H3ThinMarginless,
  PriceLabel,
} from './SubscriptionsView.Styled';

const AlignedColumnLink = ({ children }) => (
  <>
    <Hidden mdUp>
      <Grid item xs={3} container justify="flex-end" alignItems="flex-end">
        {children}
      </Grid>
    </Hidden>
    <Hidden smDown>
      <Grid item xs={2} container justify="flex-end" alignItems="flex-start">
        {children}
      </Grid>
    </Hidden>
  </>
);

const AsyncElement = ({
  ErrorElement = Fragment,
  error,
  children,
  fetching,
}) => {
  if (fetching) {
    return <CubesLoader size={48} />;
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
  } = subscriptionPlanData || {};

  return (
    <AsyncElement
      error={organizationRequestError}
      fetching={isOrganizationFetching}
    >
      <PlanContainer>
        <Grid container spacing={2}>
          <Grid item sm={12} md={3} container justify="flex-end">
            <PlanNameLabel>{planName}</PlanNameLabel>
          </Grid>
          <Grid item sm={9} md={7}>
            <div>
              <BigPriceLabel>{planPricePerUser}</BigPriceLabel>
              <PriceLabel>/user</PriceLabel>
            </div>
            <div>
              <H3ThinMarginless>{planSubscriptionPeriod}</H3ThinMarginless>
            </div>
          </Grid>
          {showSubscriptionPlans && (
            <Grid
              item
              sm={3}
              md={2}
              container
              justify="flex-end"
              alignItems="flex-end"
            >
              <PlanColumnLink to="" onClick={showSubscriptionPlans}>
                Change plans
              </PlanColumnLink>
            </Grid>
          )}
        </Grid>
        <CurrentPlanDivider />
        <Grid container spacing={2}>
          <Grid item sm={12} md={3} container justify="flex-end">
            <H1Bold>{planTotalPayment}</H1Bold>
          </Grid>
          <Grid
            item
            sm={9}
            md={7}
            container
            direction="column"
            justify="center"
          >
            <H3Marginless>{planNextPaymentLabel}</H3Marginless>
            <H3ThinMarginless>{planNextPaymentDate}</H3ThinMarginless>
          </Grid>
          {showSubscriptionPlans && (
            <AlignedColumnLink>
              <PlanColumnLink to="/billing">
                View billing & invoices
              </PlanColumnLink>
            </AlignedColumnLink>
          )}
        </Grid>
      </PlanContainer>
    </AsyncElement>
  );
};

export default CurrentPlan;
