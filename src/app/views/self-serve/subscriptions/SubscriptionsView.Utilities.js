import moment from 'moment';

export const BILLING_FREQUENCY = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const SUBSCRIPTION_PLANS = {
  PLAN_30_DAY_TRIAL: 'PLAN_30_DAY_TRIAL',
  PLAN_60_DAY_TRIAL: 'PLAN_60_DAY_TRIAL',
  PLAN_90_DAY_TRIAL: 'PLAN_90_DAY_TRIAL',
  PLAN_STANDARD: 'PLAN_STANDARD',
  PLAN_PREMIUM: 'PLAN_PREMIUM',
  PLAN_ENTERPRISE: 'PLAN_ENTERPRISE',
};

export const getSubscriptionPlanName = ({ subscription }) => {
  const { subscriptionPlan } = subscription || {};

  switch (subscriptionPlan) {
    case SUBSCRIPTION_PLANS.PLAN_30_DAY_TRIAL:
      return 'Free 30 day trial';
    case SUBSCRIPTION_PLANS.PLAN_60_DAY_TRIAL:
      return 'Free 60 day trial';
    case SUBSCRIPTION_PLANS.PLAN_90_DAY_TRIAL:
      return 'Free 90 day trial';
    case SUBSCRIPTION_PLANS.PLAN_STANDARD:
      return 'Standard';
    case SUBSCRIPTION_PLANS.PLAN_PREMIUM:
      return 'Premium';
    case SUBSCRIPTION_PLANS.PLAN_ENTERPRISE:
      return 'Enterprise';
    default:
      return '';
  }
};

export const getSubscriptionPlanTrialLabel = ({ subscription }) => {
  const { subscriptionPlan } = subscription || {};

  switch (subscriptionPlan) {
    case SUBSCRIPTION_PLANS.PLAN_30_DAY_TRIAL:
      return '30 day';
    case SUBSCRIPTION_PLANS.PLAN_60_DAY_TRIAL:
      return '60 day';
    case SUBSCRIPTION_PLANS.PLAN_90_DAY_TRIAL:
      return '90 day';
    default:
      return '';
  }
};

export const getSubscriptionPlanPrice = ({ subscription }) => {
  const { subscriptionPlan, billingFrequency = BILLING_FREQUENCY.MONTHLY } =
    subscription || {};

  switch (subscriptionPlan) {
    case SUBSCRIPTION_PLANS.PLAN_30_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_60_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_90_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_STANDARD:
      return billingFrequency === BILLING_FREQUENCY.MONTHLY ? 19 : 171;
    case SUBSCRIPTION_PLANS.PLAN_PREMIUM:
      return billingFrequency === BILLING_FREQUENCY.MONTHLY ? 24 : 216;
    case SUBSCRIPTION_PLANS.PLAN_ENTERPRISE:
      return billingFrequency === BILLING_FREQUENCY.MONTHLY ? 30 : 270;
    default:
      return 0;
  }
};

export const priceFormatter = ({ price }) =>
  `$${(Number(price) || 0).toFixed(2)}`;

export const getSubscriptionPlanPeriodName = ({ subscription }) => {
  const { billingFrequency = BILLING_FREQUENCY.MONTHLY } = subscription || {};

  return billingFrequency === BILLING_FREQUENCY.MONTHLY
    ? 'Monthly subscription'
    : 'Annual subscription';
};

export const getSubscriptionPlanBillingPeriod = ({ subscription }) => {
  const { billingFrequency = BILLING_FREQUENCY.MONTHLY } = subscription || {};

  const { billingFrequencyLabel, billingPeriodLabel } =
    billingFrequency === BILLING_FREQUENCY.MONTHLY
      ? { billingFrequencyLabel: 'monthly', billingPeriodLabel: 'month' }
      : { billingFrequencyLabel: 'annually', billingPeriodLabel: 'year' };

  return `Billed ${billingFrequencyLabel} on first day of each ${billingPeriodLabel}`;
};

export const getSubscriptionIsTrial = ({ subscription }) => {
  const { subscriptionPlan } = subscription || {};

  return [
    SUBSCRIPTION_PLANS.PLAN_30_DAY_TRIAL,
    SUBSCRIPTION_PLANS.PLAN_60_DAY_TRIAL,
    SUBSCRIPTION_PLANS.PLAN_90_DAY_TRIAL,
  ].includes(subscriptionPlan);
};

export const getSubscriptionNextPaymentLabel = ({ subscription }) => {
  const planIsTrial = getSubscriptionIsTrial({ subscription });

  return planIsTrial ? 'Your trial period' : 'Your next payment';
};

const currentMoment = moment();

export const getSubscriptionNextPaymentDate = ({ subscription }) => {
  const planIsTrial = getSubscriptionIsTrial({ subscription });

  const {
    createdDateTime,
    billingFrequency = BILLING_FREQUENCY.MONTHLY,
    trialEndDate,
  } = subscription || {};
  const planIsMonthly = billingFrequency === BILLING_FREQUENCY.MONTHLY;

  let outputMoment = moment()
    .set('month', currentMoment.month())
    .set('year', currentMoment.year())
    .add(1, planIsMonthly ? 'month' : 'year');

  const momentFormat = planIsTrial ? '[ends on] L' : '[charged on] L';

  if (trialEndDate && planIsTrial) {
    outputMoment = moment(trialEndDate);
  }

  if (createdDateTime && !planIsTrial) {
    outputMoment = moment(createdDateTime).add(
      1,
      planIsMonthly ? 'month' : 'year',
    );
  }

  return outputMoment.format(momentFormat);
};

export const getSubscriptionPlanData = ({ organization, selectedUsers }) => {
  const { subscriptionDetails: subscription } = organization || {};

  const planName = getSubscriptionPlanName({ subscription });
  const planPricePerUser = getSubscriptionPlanPrice({ subscription });
  const planSubscriptionPeriod = getSubscriptionPlanPeriodName({
    subscription,
  });
  const planBillingPeriod = getSubscriptionPlanBillingPeriod({ subscription });
  const planIsTrial = getSubscriptionIsTrial({ subscription });
  const planNextPaymentLabel = getSubscriptionNextPaymentLabel({
    subscription,
  });
  const planNextPaymentDate = getSubscriptionNextPaymentDate({ subscription });

  return {
    planName,
    planPricePerUser: priceFormatter({ price: planPricePerUser }),
    planTotalPayment: priceFormatter({
      price: planPricePerUser * selectedUsers.length,
    }),
    planSubscriptionPeriod,
    planBillingPeriod,
    planNextPaymentLabel,
    planNextPaymentDate,
    planIsTrial,
  };
};
