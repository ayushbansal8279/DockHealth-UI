import moment from 'moment';

export const SUBSCRIPTION_PERIOD = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const getSubscriptionPlanName = ({ subscription }) => {
  const { subscriptionPlan } = subscription || {};

  switch (subscriptionPlan) {
    case 'PLAN_30_DAY_TRIAL':
      return 'Free 30 day trial';
    case 'PLAN_60_DAY_TRIAL':
      return 'Free 60 day trial';
    case 'PLAN_90_DAY_TRIAL':
      return 'Free 90 day trial';
    case 'PLAN_STANDARD':
      return 'Standard';
    case 'PLAN_PREMIUM':
      return 'Premium';
    case 'PLAN_ENTERPRISE':
      return 'Enterprise';
    default:
      return '';
  }
};

export const getSubscriptionPlanPrice = ({ subscription }) => {
  const { subscriptionPlan, subscriptionPeriod = SUBSCRIPTION_PERIOD.MONTHLY } =
    subscription || {};

  switch (subscriptionPlan) {
    case 'PLAN_30_DAY_TRIAL':
    case 'PLAN_60_DAY_TRIAL':
    case 'PLAN_90_DAY_TRIAL':
    case 'PLAN_STANDARD':
      return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY ? 19 : 171;
    case 'PLAN_PREMIUM':
      return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY ? 24 : 216;
    case 'PLAN_ENTERPRISE':
      return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY ? 30 : 270;
    default:
      return 0;
  }
};

export const priceFormatter = ({ price }) =>
  `$${(Number(price) || 0).toFixed(2)}`;

export const getSubscriptionPlanPeriodName = ({ subscription }) => {
  const { subscriptionPeriod = SUBSCRIPTION_PERIOD.MONTHLY } =
    subscription || {};

  return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY
    ? 'Monthly subscription'
    : 'Annual subscription';
};

export const getSubscriptionPlanBillingPeriod = ({ subscription }) => {
  const { subscriptionPeriod = SUBSCRIPTION_PERIOD.MONTHLY } =
    subscription || {};

  const { subscriptionPeriodLabel, billingPeriodLabel } =
    subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY
      ? { subscriptionPeriodLabel: 'monthly', billingPeriodLabel: 'month' }
      : { subscriptionPeriodLabel: 'annually', billingPeriodLabel: 'year' };

  return `Billed ${subscriptionPeriodLabel} on first day of each ${billingPeriodLabel}`;
};

const currentMoment = moment();

export const getSubscriptionPlanData = ({ organization, selectedUsers }) => {
  const { subscriptionDetails: subscription } = organization || {};

  const planName = getSubscriptionPlanName({ subscription });
  const planPricePerUser = getSubscriptionPlanPrice({ subscription });
  const planSubscriptionPeriod = getSubscriptionPlanPeriodName({
    subscription,
  });
  const planBillingPeriod = getSubscriptionPlanBillingPeriod({ subscription });
  const planNextPaymentDate = moment(subscription?.createdDateTime ?? undefined)
    .set('month', currentMoment.month())
    .set('year', currentMoment.year())
    .add(1, 'month')
    .format('L');

  return {
    planName,
    planPricePerUser: priceFormatter({ price: planPricePerUser }),
    planTotalPayment: priceFormatter({
      price: planPricePerUser * selectedUsers.length,
    }),
    planSubscriptionPeriod,
    planBillingPeriod,
    planNextPaymentDate,
  };
};
