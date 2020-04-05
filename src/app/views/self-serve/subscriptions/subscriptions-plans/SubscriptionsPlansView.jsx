import { Button, Grid } from '@material-ui/core';
import { Done, Add } from '@material-ui/icons';
import React, { useCallback, useState } from 'react';
import { useUnmount } from 'react-use';
import { IntercomAPI } from 'react-intercom';
import Spacing from '../../../../components/common/Spacing';
import { MontserratTypography } from '../../../../theme-montserrat';
import { BILLING_FREQUENCY } from '../SubscriptionsView.Utilities';
import {
  SubscriptionPlanDarkPanel,
  SubscriptionPlanPanel,
  SubscriptionsPlansInnerContainer,
  SubscriptionsPlansViewContainer,
  SubscriptionEnterprisePanel,
  MediumGreyLabelContainer,
  StyledAnchor,
  StyledAnchorDiv,
} from './SubscriptionsPlansView.Styled';
import { subscriptionPlanData as subscriptionGlobalPlanData } from './SubscriptionsPlansView.PlanData';

const standardFeaturesList = [
  'Create tasks with patient context',
  'Add Subtasks',
  'Team commenting',
  'Assign/reassign tasks',
  'Add due dates',
  'Flag & set task status',
  'Duplicate tasks',
  'Create multiple lists',
  'View history of events',
  'Forward email to your task lists',
  'Add Attachments or call',
];

const renderStandardFeature = feature => (
  <>
    <Grid container wrap="nowrap" alignItems="center">
      <Done color="inherit" fontSize="small" fontWeight="bold" />
      <Spacing horizontal={3} />
      <MontserratTypography variant="h4" weight="500" color="inherit">
        {feature}
      </MontserratTypography>
    </Grid>
    <Spacing vertical={2} />
  </>
);

const enterpriseFeaturesList = [
  'EHR integration',
  'Custom email addresses',
  'Custom email scripts/integrations',
  'Uploading of patient profiles',
  'Custom protocols',
  'Modify BAA',
  'Single sign on',
];

const renderEnterpriseFeature = feature => (
  <>
    <Grid container wrap="nowrap" alignItems="center">
      <Add color="inherit" fontSize="small" fontWeight="bold" />
      <Spacing horizontal={3} />
      <MediumGreyLabelContainer>
        <MontserratTypography variant="h4" weight="500" color="inherit">
          {feature}
        </MontserratTypography>
      </MediumGreyLabelContainer>
    </Grid>
    <Spacing vertical={2} />
  </>
);

const activateIntercom = () => {
  IntercomAPI('show');
};

const SubscriptionsPlansView = ({
  chosenPlan,
  setChosenPlan,
  currentPlan,
  toggleAnnualPayment: toggleAnnualPaymentRaw,
  recalculateEstimate,
  billingFrequency,
}) => {
  const [chosenSubscriptionPlan, setChosenSubscriptionPlan] = useState(
    chosenPlan?.subscriptionPlan,
  );
  const [chosenBillingFrequency, setChosenBillingFrequency] = useState(
    billingFrequency,
  );

  const changeSubscriptionPlan = useCallback(
    ({ subscriptionPlan, billingFrequency: changedBillingFrequency }) => {
      if (subscriptionPlan) {
        setChosenSubscriptionPlan(subscriptionPlan);
      }

      return recalculateEstimate(
        subscriptionPlan ??
          chosenSubscriptionPlan ??
          chosenPlan?.subscriptionPlan,
        changedBillingFrequency ?? chosenBillingFrequency,
      );
    },
    [
      chosenBillingFrequency,
      chosenPlan,
      chosenSubscriptionPlan,
      recalculateEstimate,
    ],
  );

  const setAnnualPayment = useCallback(
    newBillingFrequency => {
      const selectedPlan =
        currentPlan === undefined ? subscriptionGlobalPlanData[0] : currentPlan;
      setChosenPlan(selectedPlan);
      setChosenBillingFrequency(newBillingFrequency);

      changeSubscriptionPlan({
        subscriptionPlan: selectedPlan.subscriptionPlan,
        billingFrequency: newBillingFrequency,
      }).then(() => {
        toggleAnnualPaymentRaw(
          newBillingFrequency === BILLING_FREQUENCY.ANNUAL,
        );
      });
    },
    [
      changeSubscriptionPlan,
      currentPlan,
      setChosenPlan,
      toggleAnnualPaymentRaw,
    ],
  );

  useUnmount(() => {
    setChosenPlan(currentPlan);
    recalculateEstimate();
  });

  return (
    <SubscriptionsPlansViewContainer>
      <MontserratTypography variant="h2">
        Select the plan that&apos;s right for you
      </MontserratTypography>
      <MontserratTypography variant="h3">
        Both payment options have all the great features you rely on
      </MontserratTypography>
      <Spacing vertical={5} />
      <SubscriptionsPlansInnerContainer>
        <SubscriptionPlanDarkPanel>
          {standardFeaturesList.map(renderStandardFeature)}
        </SubscriptionPlanDarkPanel>
        <SubscriptionPlanPanel>
          <Grid container direction="column">
            <MontserratTypography variant="h2">
              <span>Pay </span>
              <b>Annually</b>
            </MontserratTypography>
            <MontserratTypography variant="h1" weight="bold">
              $180
            </MontserratTypography>
            <Spacing vertical={1} />
            <MontserratTypography variant="h4" weight="bold">
              Per User per Year
            </MontserratTypography>
          </Grid>
          <Grid container direction="column">
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={() => setAnnualPayment(BILLING_FREQUENCY.ANNUAL)}
            >
              PAY ANNUALLY
            </Button>
            <Spacing vertical={4} />
            <MediumGreyLabelContainer>
              <MontserratTypography variant="h4" color="inherit">
                Save 25% by paying annually
              </MontserratTypography>
            </MediumGreyLabelContainer>
          </Grid>
        </SubscriptionPlanPanel>
        <div />
        <SubscriptionPlanPanel>
          <Grid container direction="column">
            <MontserratTypography variant="h2">
              <span>Pay </span>
              <b>Monthly</b>
            </MontserratTypography>
            <MontserratTypography variant="h1" weight="bold">
              $20
            </MontserratTypography>
            <Spacing vertical={1} />
            <MontserratTypography variant="h4" weight="bold">
              Per User per Month
            </MontserratTypography>
          </Grid>
          <Grid container direction="column">
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={() => setAnnualPayment(BILLING_FREQUENCY.MONTHLY)}
            >
              PAY MONTHLY
            </Button>
            <Spacing vertical={4} />
            <MediumGreyLabelContainer>
              <MontserratTypography variant="h4" color="inherit">
                Cancel at anytime
              </MontserratTypography>
            </MediumGreyLabelContainer>
          </Grid>
        </SubscriptionPlanPanel>
      </SubscriptionsPlansInnerContainer>
      <Spacing vertical={5} />
      <SubscriptionEnterprisePanel>
        <div>
          <Grid container wrap="nowrap" alignItems="center">
            <Done color="inherit" fontSize="small" fontWeight="bold" />
            <Spacing horizontal={3} />
            <MediumGreyLabelContainer>
              <MontserratTypography variant="h4" weight="500" color="inherit">
                All the features of Dock Primary, plus:
              </MontserratTypography>
            </MediumGreyLabelContainer>
          </Grid>
          <Spacing vertical={2} />
          {enterpriseFeaturesList.map(renderEnterpriseFeature)}
        </div>
        <div />
        <Grid container direction="column">
          <MontserratTypography variant="h2">
            <span>Dock </span>
            <b>Enterprise</b>
          </MontserratTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4" weight="bold">
            Contact Us for Pricing
          </MontserratTypography>
          <Spacing vertical={4} />
          <MontserratTypography variant="h4">
            <StyledAnchor href="mailto:support@dock.health?Subject=Dock%20Enterprise">
              EMAIL US
            </StyledAnchor>
            <span>, </span>
            <StyledAnchorDiv onClick={activateIntercom}>CHAT</StyledAnchorDiv>
          </MontserratTypography>
          <Spacing vertical={4} />
          <MediumGreyLabelContainer>
            <MontserratTypography variant="h4">
              <span>or call us at </span>
              <StyledAnchor href="tel:(857)-302-0441">
                (857)-302-0441
              </StyledAnchor>
            </MontserratTypography>
          </MediumGreyLabelContainer>
        </Grid>
      </SubscriptionEnterprisePanel>
      <Spacing vertical={4} />
      <MediumGreyLabelContainer>
        <MontserratTypography variant="h4">
          <b>Have questions? </b>
          <StyledAnchor href="mailto:support@dock.health?Subject=Dock%20Support">
            email us
          </StyledAnchor>
          <span>, </span>
          <StyledAnchorDiv onClick={activateIntercom}>chat</StyledAnchorDiv>
          <span> or call us at </span>
          <StyledAnchor href="tel:(857)-302-0441">(857)-302-0441</StyledAnchor>
        </MontserratTypography>
      </MediumGreyLabelContainer>
      <Spacing vertical={4} />
      {/* <TermsLabel style={{ fontWeight: 'bold', marginBottom: 0 }}> */}
      {/*   * How long is this free? */}
      {/* </TermsLabel> */}
      {/* <TermsLabel style={{ marginTop: 0 }}> */}
      {/*   Before our decision to focus on the COVID-19 response, Dock Health */}
      {/*   offered a 30-day free trial and a subscription model of $20/user/month. */}
      {/*   In light of the urgent need to take care of providers, help them get */}
      {/*   organized and provide them the most relevant information easily, we have */}
      {/*   decided to make it free as long as it can be helpful during this public */}
      {/*   health crisis. We are clinicians and we are optimists. We know this will */}
      {/*   get hard, but we also know we will overcome this. When the dust settles, */}
      {/*   we will be clear and give folks lots of time to prepare if a paid */}
      {/*   subscription is the right choice for you down the road. */}
      {/* </TermsLabel> */}
    </SubscriptionsPlansViewContainer>
  );
};

export default SubscriptionsPlansView;
