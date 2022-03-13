export const SubscriptionPlan = {
  STANDARD: 'PLAN_STANDARD',
  PREMIUM: 'PLAN_PREMIUM',
  ENTERPRISE: 'PLAN_ENTERPRISE',
};

export const PROFESSIONAL_SERVICES_PRICE = 500;

export const SUBSCRIPTION_PLANS = [
  {
    key: SubscriptionPlan.STANDARD,
    label: 'Basic',
    description: 'For individuals and small teams',
    color: '#38BBCC',
    annualMonthlyPrice: 15,
    annualPrice: 180,
    monthlyPrice: 20,
    subscriptionPlan: SubscriptionPlan.STANDARD,
    isFreeTrialPlan: true,
    mostPopular: false,
    featuresDescription: 'Included with subscription',
    features: [
      'Secure task management',
      'Workflow Library and standard templates',
      'Unlimited lists and users',
      '2 free outside guests',
      'Upload patient data',
      'Email integration',
    ],
  },
  {
    key: SubscriptionPlan.PREMIUM,
    label: 'Premium',
    description: 'For medium and large companies',
    color: '#047A95',
    annualMonthlyPrice: 25,
    annualPrice: 300,
    monthlyPrice: 30,
    subscriptionPlan: SubscriptionPlan.PREMIUM,
    isFreeTrialPlan: true,
    mostPopular: true,
    featuresDescription: 'All of the Basic features Plus:',
    features: [
      'Unlimited SmartFlows',
      'Custom fields & Lists',
      'Custom patient profiles',
      'Unlimited file storage',
      'Multi-user groups',
      'Analytics dashboard',
    ],
    comingSoonFeatures: [],
  },
  {
    key: SubscriptionPlan.ENTERPRISE,
    label: 'Custom/Enterprise',
    description: 'Customized just for you',
    color: '#000000',
    subscriptionPlan: SubscriptionPlan.ENTERPRISE,
    selectable: false,
    mostPopular: false,
    featuresDescription: 'All of the Premium features Plus:',
    features: [
      'Custom EHR integrations and automations',
      'Single Sign On (SSO)',
      'LDAP/AD integration',
      'User Management',
      'Custom analytics',
      'EHR Embedded Solutions',
      'Custom BAA',
    ],
  },
];

export const UserSubscriptionStatus = {
  ALL: Symbol('ALL'),
  SUBSCRIBED: Symbol('SUBSCRIBED'),
  UNSUBSCRIBED: Symbol('UNSUBSCRIBED'),
};

export const BillingFrequency = {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const getSubscriptionPlanLabel = ({ subscription }) => {
  return subscription?.subscriptionPlanName;
};

export const priceFormatter = price => {
  const priceAmount = `${(Number(price) || 0).toFixed(2)}`;
  const formattedPrice = `${priceAmount}`.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1,',
  );
  return `$${formattedPrice}`;
};

export function isPlanTrial(subscription) {
  return !subscription || !!subscription.trialEndDate;
}

export function isPlanFree(subscription) {
  return subscription?.subscriptionPlan === 'PLAN_FREE';
}
