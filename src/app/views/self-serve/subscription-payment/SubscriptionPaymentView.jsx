import Grid from '@material-ui/core/Grid';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { setHeader } from '../../../actions/header-actions';
import {
  getBillingEstimate,
  setPaymentNewPlan,
} from '../../../actions/organization-actions';
import { saveBillingDetails } from '../../../api/organization-api';
import CubesLoader from '../../../components/common/CubesLoader';
import { noop, showAlert } from '../../../helpers/utility-functions';
import useBoolean from '../../../hooks/useBoolean';
import BillingsViewBillingData from '../billings/BillingsView.BillingData';
import { PlanNameLabel } from '../subscriptions/SubscriptionsView.CurrentPlan.Styled';
import {
  BigPriceLabel,
  H1Bold,
  H3ThinMarginless,
  PriceLabel,
} from '../subscriptions/SubscriptionsView.Styled';
import {
  BILLING_FREQUENCY,
  getSubscriptionPlanData,
} from '../subscriptions/SubscriptionsView.Utilities';
import {
  BillingButton,
  H2,
  PricingGridContainer,
  PricingItemDivider,
  PricingItemVerticallyExpanded,
  Spacing2,
  SubscriptionPaymentViewContainer,
} from './SubscriptionPaymentView.Components';

const finishSubscriptionPayment = () => {
  hashHistory.replace('/subscription-payment-finished');
};

const cancelSubscriptionPayment = () => {
  hashHistory.push('/subscriptions');
};

const goToSubscriptions = () => {
  hashHistory.replace('/subscriptions');
};

/**
 * @param stripe - Stripe instance
 */
const onSubmit = ({
  subscriptionPlan,
  billingFrequency,
  setProcessingPayment,
  unsetProcessingPayment,
  // eslint-disable-next-line unicorn/consistent-function-scoping
}) => ({ stripe }) => data => {
  setProcessingPayment();

  stripe
    .createToken({ name: 'cardNumber' })
    .then(token => {
      if (token.error) {
        throw token.error;
      }
      const billingData = data;
      billingData.subscriptionDetails = {
        subscriptionPlan,
        billingFrequency,
      };
      saveBillingDetails({
        billingData,
        token,
      })
        .then(() => {
          finishSubscriptionPayment();

          unsetProcessingPayment();
        })
        .catch(() => {
          showAlert({
            status: 'error',
            title: 'Error',
            text:
              'Could not update subscription details, please try again later',
          });

          unsetProcessingPayment();
        });
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.message ??
          'Could not update subscription details, please try again later',
      });

      unsetProcessingPayment();
    });
};

const getSaveBillingElement = ({ onCancelClick, processingPayment }) => () => (
  <>
    <Spacing2 />
    <Grid item sm={12} container justify="flex-end">
      <BillingButton
        onClick={onCancelClick}
        variant="outlined"
        disabled={processingPayment}
      >
        Cancel
      </BillingButton>
      <BillingButton
        type="submit"
        variant="contained"
        disabled={processingPayment}
      >
        {processingPayment ? <CubesLoader color="#fff" size={32} /> : 'Buy now'}
      </BillingButton>
    </Grid>
  </>
);

const SubscriptionPaymentView = () => {
  const dispatch = useDispatch();

  const { newPaymentPlan, currentUsers } = useSelector(store => ({
    ...store.organizationState,
    organizationIdentifier:
      store.userState?.userProfile?.organizationIdentifier,
  }));

  const onCancelClick = useCallback(() => {
    cancelSubscriptionPayment();
    setPaymentNewPlan({ newPlan: null })(dispatch);
  }, [dispatch]);

  const [
    processingPayment,
    setProcessingPayment,
    unsetProcessingPayment,
  ] = useBoolean(false);

  useMount(() => {
    if (!newPaymentPlan || !currentUsers) {
      goToSubscriptions();
    }

    setHeader(dispatch)({
      backgroundColor: '#007cab',
      layout: [
        {
          key: 'title',
          component: <div />,
          alignItems: 'center',
        },
      ],
    });

    getBillingEstimate()(dispatch);
  });

  const { annualMonthlyPrice, subscriptionPlan, annualPayment, monthlyPrice } =
    newPaymentPlan || {};

  const totalPerUserCost = annualPayment ? annualMonthlyPrice : monthlyPrice;
  const billingFrequency = annualPayment
    ? BILLING_FREQUENCY.ANNUAL
    : BILLING_FREQUENCY.MONTHLY;

  const currentUsersCount = currentUsers?.length ?? 0;

  const {
    planName,
    planPricePerUser,
    planTotalPayment,
    planSubscriptionPeriod,
  } = getSubscriptionPlanData({
    organization: {
      subscriptionDetails: {
        subscriptionPlan,
        billingFrequency,
      },
    },
    billingData: {
      monthlyPerUserCost: totalPerUserCost,
      monthlyEstimate: currentUsersCount * totalPerUserCost,
      annualEstimate: currentUsersCount * totalPerUserCost * 12,
    },
  });

  return (
    <SubscriptionPaymentViewContainer>
      <Grid container spacing={32}>
        <Grid item sm={12}>
          <H2>Please enter your payment information</H2>
        </Grid>
        <Grid item sm={12}>
          <PricingGridContainer>
            <PricingItemVerticallyExpanded>
              <Grid container alignItems="flex-end" direction="column">
                <PlanNameLabel>{planName}</PlanNameLabel>
                <H3ThinMarginless>{planSubscriptionPeriod}</H3ThinMarginless>
              </Grid>
            </PricingItemVerticallyExpanded>
            <Grid container alignItems="center" justify="flex-end">
              <BigPriceLabel>{planPricePerUser}</BigPriceLabel>
            </Grid>
            <Grid container alignItems="center">
              <PriceLabel>per user</PriceLabel>
            </Grid>
            <Grid container alignItems="center" justify="flex-end">
              <BigPriceLabel>{currentUsersCount}</BigPriceLabel>
            </Grid>
            <Grid container alignItems="center">
              <PriceLabel>users</PriceLabel>
            </Grid>
            <PricingItemDivider />
            <div />
            <Grid container alignItems="center" justify="flex-end">
              <H1Bold>{planTotalPayment}</H1Bold>
            </Grid>
            <Grid container alignItems="center">
              <PriceLabel>charged today</PriceLabel>
            </Grid>
          </PricingGridContainer>
        </Grid>
        <Grid item sm={12}>
          <Elements
            locale="en-US"
            fonts={[
              {
                cssSrc:
                  'https://fonts.googleapis.com/css?family=Open+Sans&display=swap',
              },
            ]}
          >
            <BillingsViewBillingData
              isUpdatingBilling
              setUpdatingBilling={noop}
              unsetUpdatingBilling={noop}
              onSubmit={onSubmit({
                subscriptionPlan,
                billingFrequency,
                processingPayment,
                setProcessingPayment,
                unsetProcessingPayment,
              })}
              SaveBillingElement={getSaveBillingElement({
                onCancelClick,
                newPaymentPlan,
                processingPayment,
              })}
            />
          </Elements>
        </Grid>
      </Grid>
    </SubscriptionPaymentViewContainer>
  );
};

export default SubscriptionPaymentView;
