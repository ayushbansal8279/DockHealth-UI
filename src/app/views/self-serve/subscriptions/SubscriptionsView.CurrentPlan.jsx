import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';

import {
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

const PLAN_NAME = 'Standard';
const PLAN_MONTHLY_PRICE = 19;
const PLAN_TOTAL_PRICE = 57;
const NEXT_PAYMENT_DATE = '01/01/2020';

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

const CurrentPlan = () => {
  return (
    <PlanContainer>
      {/* First row */}
      <Grid container>
        <Grid item sm={12} md={2}>
          <PlanNameLabel>{PLAN_NAME}</PlanNameLabel>
        </Grid>
        <Grid item sm={9} md={8}>
          <div>
            <BigPriceLabel>{PLAN_MONTHLY_PRICE}</BigPriceLabel>
            <PriceLabel>/user</PriceLabel>
          </div>
          <div>
            <H3ThinMarginless>Monthly subscription</H3ThinMarginless>
          </div>
        </Grid>
        <Grid
          item
          sm={3}
          md={2}
          container
          justify="flex-end"
          alignItems="flex-end"
        >
          <PlanColumnLink to="/subscriptions-plans">
            Change plans
          </PlanColumnLink>
        </Grid>
      </Grid>
      {/* Divider */}
      <Grid container>
        <Grid item xs={12}>
          <hr />
        </Grid>
      </Grid>
      {/* Second row */}
      <Grid container>
        <Grid item sm={12} md={2}>
          <H1Bold>{PLAN_TOTAL_PRICE}</H1Bold>
        </Grid>
        <Grid item sm={9} md={8} container direction="column" justify="center">
          <H3Marginless>Your next payment</H3Marginless>
          <H3ThinMarginless>charged on {NEXT_PAYMENT_DATE}</H3ThinMarginless>
        </Grid>
        <AlignedColumnLink>
          <PlanColumnLink to="/billings">View billings</PlanColumnLink>
        </AlignedColumnLink>
      </Grid>
    </PlanContainer>
  );
};

export default CurrentPlan;
