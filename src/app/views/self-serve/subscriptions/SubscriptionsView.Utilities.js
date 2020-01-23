import moment from 'moment';

export const SUBSCRIPTION_PERIOD = {
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

export const getSubscriptionPlanPrice = ({ subscription }) => {
  const { subscriptionPlan, subscriptionPeriod = SUBSCRIPTION_PERIOD.MONTHLY } =
    subscription || {};

  switch (subscriptionPlan) {
    case SUBSCRIPTION_PLANS.PLAN_30_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_60_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_90_DAY_TRIAL:
    case SUBSCRIPTION_PLANS.PLAN_STANDARD:
      return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY ? 19 : 171;
    case SUBSCRIPTION_PLANS.PLAN_PREMIUM:
      return subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY ? 24 : 216;
    case SUBSCRIPTION_PLANS.PLAN_ENTERPRISE:
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
    subscriptionPeriod = SUBSCRIPTION_PERIOD.MONTHLY,
    trialEndDate,
  } = subscription || {};
  const planIsMonthly = subscriptionPeriod === SUBSCRIPTION_PERIOD.MONTHLY;

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
