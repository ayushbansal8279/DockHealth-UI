import { Grid } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMount } from 'react-use';
import { checkIfUserIsOrganizationAdmin } from 'helpers/user-helper';
import {
  getBillingEstimate,
  setPaymentNewPlan,
} from 'actions/organization-actions';
import { saveBillingDetails } from 'api/organization-api';
import {
  currentSubscriptionPlanSelector,
  organizationSelector,
} from 'selectors/organization-selectors';
import ViewLayout from 'components/template/ViewLayout/ViewLayout';
import LayoutHeader from 'components/template/LayoutHeader/LayoutHeader';
import Spacing from 'components/common/Spacing';
import { getUserByEmail } from 'api/user-auth-api';
import { noop, showAlert } from 'helpers/utility-functions';
import { useBoolean } from 'hooks/useBoolean';
import { SUBS_SETTINGS_PATH } from 'routing/helpers/paths';
import { MontserratTypography } from 'styles/theme-montserrat';
import {
  BillingFrequency,
  priceFormatter,
  PROFESSIONAL_SERVICES_PRICE,
  SUBSCRIPTION_PLANS,
} from 'helpers/subscription-helper';
import { userProfileSelector } from 'selectors/user-selectors';
import { log } from 'helpers/log';
import BillingsViewBillingData from '../billings/BillingData/BillingData';
import {
  DarkBlueTextContainer,
  PricingGridContainer,
  PricingItemDivider,
  PricingItemVerticallyExpanded,
  StyledLink,
  SubscriptionPaymentViewContainer,
} from './SubscriptionPaymentView.Components';

const finishSubscriptionPayment = (history, currentUser) => {
  getUserByEmail(currentUser.email, currentUser);
  history.replace('/settings/subscription-payment-finished');
};

const cancelSubscriptionPayment = (history) => {
  history.push(SUBS_SETTINGS_PATH);
};

const goToSubscriptions = (history) => {
  history.replace(SUBS_SETTINGS_PATH);
};

/**
 * @param stripe - Stripe instance
 */
const onSubmit =
  ({
    subscriptionPlan,
    billingFrequency,
    professionalServicesIncluded,
    setProcessingPayment,
    unsetProcessingPayment,
    history,
    currentUser,
    // eslint-disable-next-line unicorn/consistent-function-scoping
  }) =>
  ({ stripe }) =>
  (data) => {
    setProcessingPayment();

    stripe
      .createToken({ name: 'cardNumber' })
      .then((token) => {
        if (token.error) {
          throw token.error;
        }
        const billingData = data;
        billingData.subscriptionDetails = {
          subscriptionPlan,
          billingFrequency,
          professionalServicesIncluded,
        };
        saveBillingDetails({
          billingData,
          token,
        })
          .then((response) => {
            if (response.statusCode === 'SUCCESS') {
              finishSubscriptionPayment(history, currentUser);
            } else {
              showAlert({
                status: 'error',
                title: 'Error',
                text: response.errorMessage,
              });
            }
            unsetProcessingPayment();
          })
          .catch((error) => {
            log(error);
            showAlert({
              status: 'error',
              title: 'Error',
              text: 'Could not save subscription details, please try again later',
            });
            unsetProcessingPayment();
          });
      })
      .catch((error) => {
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

const stripePromise = loadStripe(
  import.meta.env.VITE_SUBSCRIPTION_TOKEN_API_KEY,
);

const SubscriptionPaymentView = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentSubscriptionPlan = useSelector(currentSubscriptionPlanSelector);
  const { activeUserCount } = currentSubscriptionPlan || {};
  const userProfile = useSelector(userProfileSelector);
  const { newPaymentPlan } = useSelector(organizationSelector);

  useEffect(() => {
    if (!checkIfUserIsOrganizationAdmin(userProfile)) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  const onCancelSaveBillingClick = useCallback(() => {
    cancelSubscriptionPayment(history);
    setPaymentNewPlan({ newPlan: null })(dispatch);
  }, [dispatch, history]);

  const onCancelPaymentClick = useCallback(() => {
    cancelSubscriptionPayment(history);
  }, [history]);

  const [processingPayment, setProcessingPayment, unsetProcessingPayment] =
    useBoolean(false);

  useMount(() => {
    if (!newPaymentPlan) {
      goToSubscriptions(history);
    }

    dispatch(getBillingEstimate());
  });

  const { subscriptionPlan, billingFrequency, professionalServicesIncluded } =
    newPaymentPlan || {};

  const newPlan = SUBSCRIPTION_PLANS.find(
    ({ subscriptionPlan: sp }) => sp === subscriptionPlan,
  );

  const { annualMonthlyPrice, monthlyPrice } = newPlan || {};

  const totalPerUserCost =
    billingFrequency === BillingFrequency.ANNUAL
      ? annualMonthlyPrice
      : monthlyPrice;

  const planTotalPayment = priceFormatter(
    activeUserCount *
      totalPerUserCost *
      (billingFrequency === BillingFrequency.ANNUAL ? 12 : 1) +
      (professionalServicesIncluded ? PROFESSIONAL_SERVICES_PRICE : 0),
  );

  const planPricePerUser = priceFormatter(totalPerUserCost);

  return (
    <ViewLayout header={<LayoutHeader />}>
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
                  justifyContent="flex-start"
                  direction="column"
                >
                  <DarkBlueTextContainer>
                    <MontserratTypography variant="h3" color="inherit">
                      <span>Pay </span>
                      <b>
                        {billingFrequency === BillingFrequency.ANNUAL
                          ? 'Annually'
                          : 'Monthly'}
                      </b>
                    </MontserratTypography>
                  </DarkBlueTextContainer>
                  <StyledLink to={SUBS_SETTINGS_PATH}>Change plans</StyledLink>
                </Grid>
              </PricingItemVerticallyExpanded>
              <Grid container alignItems="center" justifyContent="flex-end">
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
              <Grid container alignItems="center" justifyContent="flex-end">
                <MontserratTypography variant="h3">
                  {activeUserCount}
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              <Grid container alignItems="center">
                <MontserratTypography variant="h3" weight="300">
                  {activeUserCount > 1 ? 'users' : 'user'}
                </MontserratTypography>
                <Spacing vertical={4} />
              </Grid>
              {professionalServicesIncluded && (
                <>
                  <Grid container alignItems="center" justifyContent="flex-end">
                    <MontserratTypography variant="h3">
                      {priceFormatter(PROFESSIONAL_SERVICES_PRICE)}
                    </MontserratTypography>
                    <Spacing vertical={4} />
                  </Grid>
                  <Grid container alignItems="center">
                    <MontserratTypography variant="h3" weight="300">
                      professional services
                    </MontserratTypography>
                    <Spacing vertical={4} />
                  </Grid>
                </>
              )}
              <PricingItemDivider />
              <div />
              <Grid container alignItems="center" justifyContent="flex-end">
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
              stripe={stripePromise}
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
                  professionalServicesIncluded,
                  processingPayment,
                  setProcessingPayment,
                  unsetProcessingPayment,
                  history,
                  currentUser: userProfile,
                })}
                firstTimeSaveBillingDetails
                processingPayment={processingPayment}
                cancelSaveBillingClick={onCancelSaveBillingClick}
              />
            </Elements>
          </Grid>
        </Grid>
      </SubscriptionPaymentViewContainer>
    </ViewLayout>
  );
};

export default SubscriptionPaymentView;
