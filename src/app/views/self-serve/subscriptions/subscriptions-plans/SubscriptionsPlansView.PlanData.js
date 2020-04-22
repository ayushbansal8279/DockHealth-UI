import palette from 'app/palette';

export const SUBSCRIPTION_PLAN_KEYS = {
  STANDARD: 'standard',
  ENTERPRISE: 'enterprise',
};

export const subscriptionPlanData = [
  {
    key: SUBSCRIPTION_PLAN_KEYS.STANDARD,
    planLabel: 'Dock',
    inactiveBackgroundColor: palette.unknownGrey6,
    annualMonthlyPrice: 15,
    monthlyPrice: 20,
    subscriptionPlan: 'PLAN_STANDARD',
    isFreeTrialPlan: true,
  },
  {
    key: SUBSCRIPTION_PLAN_KEYS.ENTERPRISE,
    planLabel: 'Custom/Enterprise',
    inactiveBackgroundColor: palette.unknownGrey6,
    subscriptionPlan: 'PLAN_ENTERPRISE',
    selectable: false,
  },
];
