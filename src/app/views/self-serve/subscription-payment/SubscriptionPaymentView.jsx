import { Grid } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Elements } from 'react-stripe-elements';
import { useMount } from 'react-use';
import { setHeader } from 'actions/template-actions';
import {
  getBillingEstimate,
  setPaymentNewPlan,
} from 'actions/organization-actions';
import { saveBillingDetails } from 'api/organization-api';
import GenericHeader from 'components/template/GenericHeader/GenericHeader';
import Spacing from 'components/common/Spacing';
import { noop, showAlert } from 'helpers/utility-functions';
import useBoolean from 'hooks/useBoolean';
import { MontserratTypography } from 'styles/theme-montserrat';
import BillingsViewBillingData from '../billings/BillingData/BillingData';
import {
  BILLING_FREQUENCY,
  getSubscriptionPlanData,
} from '../subscriptions/helpers';
import {
  DarkBlueTextContainer,
  PricingGridContainer,
  PricingItemDivider,
  PricingItemVerticallyExpanded,
  StyledLink,
  SubscriptionPaymentViewContainer,
  SubscriptionPaymentViewOuterContainer,
} from './SubscriptionPaymentView.Components';

const finishSubscriptionPayment = history => {
  history.replace('/settings/subscription-payment-finished');
};

const cancelSubscriptionPayment = history => {
  history.push('/settings/subscriptions');
};

const goToSubscriptions = history => {
  history.replace('/settings/subscriptions');
};

/**
 * @param stripe - Stripe instance
 */
const onSubmit = ({
  subscriptionPlan,
  billingFrequency,
  setProcessingPayment,
  unsetProcessingPayment,
  history,
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
        .then(response => {
          if (response.statusCode === 'SUCCESS') {
            finishSubscriptionPayment(history);
          } else {
            showAlert({
              status: 'error',
              title: 'Error',
              text: response.errorMessage,
            });
          }
          unsetProcessingPayment();
        })
        .catch(() => {
          showAlert({
            status: 'error',
            title: 'Error',
            text: 'Could not save subscription details, please try again later',
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

const SubscriptionPaymentView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { newPaymentPlan, currentUsers } = useSelector(store => ({
    ...store.organizationState,
    organizationIdentifier:
      store.userState?.userProfile?.organizationIdentifier,
  }));

  const onCancelSaveBillingClick = useCallback(() => {
    cancelSubscriptionPayment(history);
    setPaymentNewPlan({ newPlan: null })(dispatch);
  }, [dispatch, history]);

  const onCancelPaymentClick = useCallback(() => {
    cancelSubscriptionPayment(history);
  }, [history]);

  const [
    processingPayment,
    setProcessingPayment,
    unsetProcessingPayment,
  ] = useBoolean(false);

  useMount(() => {
    if (!newPaymentPlan || !currentUsers) {
      goToSubscriptions(history);
    }

    dispatch(
      setHeader({
        layout: [
          {
            key: 'title',
            component: <GenericHeader />,
            alignItems: 'center',
          },
        ],
      }),
    );

    getBillingEstimate()(dispatch);
  });

  const { annualMonthlyPrice, subscriptionPlan, annualPayment, monthlyPrice } =
    newPaymentPlan || {};

  const totalPerUserCost = annualPayment ? annualMonthlyPrice : monthlyPrice;
  const billingFrequency = annualPayment
    ? BILLING_FREQUENCY.ANNUAL
    : BILLING_FREQUENCY.MONTHLY;

  const currentUsersCount = currentUsers?.length ?? 0;

  const { planPricePerUser, planTotalPayment } = getSubscriptionPlanData({
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
      subscriptionDetails: {
        subscriptionPlan,
        billingFrequency,
      },
    },
  });

  return (
    <SubscriptionPaymentViewOuterContainer>
      <SubscriptionPaymentViewContainer>
        <Grid container spacing={4}>
          <Grid item sm={12}>
            <MontserratTypography variant="h2">
              Please enter your payment information
            </MontserratTypography>
          </Grid>
          <Grid item sm={12}>
            <PricingGridContainer>
              <PricingItemVerticallyExpanded>
                <Grid
                  container
                  alignItems="flex-start"
                  justify="flex-start"
                  direction="column"
                >
                  <DarkBlueTextContainer>
                    <MontserratTypography variant="h3" color="inherit">
                      <span>Pay </span>
                      <b>{annualPayment ? 'Annually' : 'Monthly'}</b>
                    </MontserratTypography>
                  </DarkBlueTextContainer>
                  <StyledLink to="/settings/subscriptions">
                    Change plans
                  </StyledLink>
                </Grid>
              </PricingItemVerticallyExpanded>
              <Grid container alignItems="center" justify="flex-end">
                <MontserratTypography variant="h3">
                  {planPricePerUser}
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              <Grid container alignItems="center">
                <MontserratTypography variant="h3" weight="300">
                  per user
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              <Grid container alignItems="center" justify="flex-end">
                <MontserratTypography variant="h3">
                  {currentUsersCount}
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              <Grid container alignItems="center">
                <MontserratTypography variant="h3" weight="300">
                  {currentUsersCount > 1 ? 'users' : 'user'}
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              <PricingItemDivider />
              <div />
              <Grid container alignItems="center" justify="flex-end">
                <Spacing vertical={4} />
                <MontserratTypography variant="h3" weight="bold">
                  {planTotalPayment}
                </MontserratTypography>
              </Grid>
              <Grid container alignItems="center">
                <Spacing vertical={4} />
                <MontserratTypography variant="h3" weight="300">
                  charged today
                </MontserratTypography>
              </Grid>
            </PricingGridContainer>
          </Grid>
          <Grid item sm={12}>
            <Elements
              locale="en-US"
              fonts={[
                {
                  cssSrc:
                    'https://fonts.googleapis.com/css?family=Montserrat&display=swap',
                },
              ]}
            >
              <BillingsViewBillingData
                isUpdatingBilling
                setUpdatingBilling={noop}
                unsetUpdatingBilling={noop}
                cancelUpdateBilling={onCancelPaymentClick}
                onSubmit={onSubmit({
                  subscriptionPlan,
                  billingFrequency,
                  processingPayment,
                  setProcessingPayment,
                  unsetProcessingPayment,
                  history,
                })}
                firstTimeSaveBillingDetails
                processingPayment={processingPayment}
                cancelSaveBillingClick={onCancelSaveBillingClick}
              />
            </Elements>
          </Grid>
        </Grid>
      </SubscriptionPaymentViewContainer>
    </SubscriptionPaymentViewOuterContainer>
  );
};

export default SubscriptionPaymentView;
