import moment from 'moment';

export const BILLING_FREQUENCY = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const getSubscriptionPlanLabel = ({ subscription }) => {
  return subscription?.subscriptionPlanName;
};

export const priceFormatter = ({ price }) => {
  const priceAmount = `${(Number(price) || 0).toFixed(2)}`;
  const formattedPrice = `${priceAmount}`.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1,',
  );
  return `$${formattedPrice}`;
};

export const getSubscriptionPlanPeriodName = ({
  billingFrequency = BILLING_FREQUENCY.MONTHLY,
}) => {
  return billingFrequency === BILLING_FREQUENCY.MONTHLY
    ? 'Monthly Billing'
    : 'Annual Billing';
};

export const getSubscriptionPlanBillingPeriod = ({
  billingFrequency = BILLING_FREQUENCY.MONTHLY,
}) =>
  billingFrequency === BILLING_FREQUENCY.MONTHLY
    ? 'Billed monthly on first day of each month'
    : 'Billed annually on your subscription anniversary';

export const getSubscriptionIsTrial = ({ subscription }) => {
  return subscription?.trialEndDate ? true : false;
};

export const getSubscriptionNextPaymentLabel = ({ subscription }) => {
  const planIsTrial = getSubscriptionIsTrial({ subscription });

  return planIsTrial ? 'Your trial period' : 'Your next payment';
};

export const getSubscriptionNextPaymentDate = ({
  subscription,
  billingData,
}) => {
  const planIsTrial = getSubscriptionIsTrial({ subscription });

  const { trialEndDate } = subscription || {};

  const { nextBillingDate } = billingData || {};

  const momentFormat = planIsTrial ? '[ends on] L' : '[charged on] L';

  let outputMoment;

  if (trialEndDate && planIsTrial) {
    outputMoment = moment(trialEndDate);
  }

  if (nextBillingDate && !planIsTrial) {
    outputMoment = moment(nextBillingDate);
  }

  return outputMoment?.format(momentFormat) ?? '';
};

export const getSubscriptionPlanData = ({ organization, billingData }) => {
  const { subscriptionDetails: subscription } = organization || {};
  const { monthlyPerUserCost, monthlyEstimate, annualEstimate } =
    billingData || {};

  const planName = subscription?.subscriptionPlanName;
  const planSubscriptionPeriod = getSubscriptionPlanPeriodName({
    billingFrequency: billingData?.subscriptionDetails?.billingFrequency,
  });
  const planBillingPeriod = getSubscriptionPlanBillingPeriod({
    billingFrequency: billingData?.subscriptionDetails?.billingFrequency,
  });
  const planIsTrial = getSubscriptionIsTrial({ subscription });
  const planNextPaymentLabel = getSubscriptionNextPaymentLabel({
    subscription,
  });
  const planNextPaymentDate = getSubscriptionNextPaymentDate({
    subscription,
    billingData,
  });

  return {
    planName,
    billingFrequency: subscription?.billingFrequency,
    planIsMonthly: subscription?.billingFrequency === BILLING_FREQUENCY.MONTHLY,
    planPricePerUser: priceFormatter({ price: monthlyPerUserCost }),
    planAnnualPricePerUser: priceFormatter({ price: monthlyPerUserCost * 12 }),
    planTotalPayment: priceFormatter({
      price:
        billingData?.subscriptionDetails?.billingFrequency ===
        BILLING_FREQUENCY.ANNUAL
          ? annualEstimate
          : monthlyEstimate,
    }),
    planSubscriptionPeriod,
    planBillingPeriod,
    planNextPaymentLabel,
    planNextPaymentDate,
    planIsTrial,
    planActiveUserCount: billingData?.activeUserCount ?? 0,
  };
};
