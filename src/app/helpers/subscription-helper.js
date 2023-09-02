export const SubscriptionPlan = {
  STANDARD: 'PLAN_STANDARD',
  PREMIUM: 'PLAN_PREMIUM',
  PRO: 'PRO',
  ENTERPRISE: 'PLAN_ENTERPRISE',
};

export const ServiceAddOns = {
  LEVEL_1: 'LEVEL_1',
  LEVEL_2: 'LEVEL_2',
  LEVEL_3: 'LEVEL_3',
};

export const PROFESSIONAL_SERVICES_PRICE = 500;

export const SUBSCRIPTION_PLANS = [
  {
    key: SubscriptionPlan.STANDARD,
    label: 'Basic',
    description:
      'For teams that need the basics of HIPAA-compliant task management and communication',
    color: '#38BBCC',
    annualMonthlyPrice: 15,
    annualPrice: 180,
    monthlyPrice: 20,
    subscriptionPlan: SubscriptionPlan.STANDARD,
    isFreeTrialPlan: true,
    mostPopular: false,
    showNewHeader: false,
    featuresDescription: 'Included with subscription',
    features: [
      'HIPAA-compliant task management',
      'Standard BAA (Business Associate Agreement)',
      'Unlimited task lists',
      'Unlimited patient profiles',
      'Unlimited users',
      'Unlimited workflow templates',
      'Configurable task statuses',
      'Patient labels/tags',
      'Create task from email',
    ],
    comingSoonFeatures: [],
    disclaimers: [],
  },
  {
    key: SubscriptionPlan.PREMIUM,
    label: 'Premium',
    description:
      'For teams that need feature customization, such as patient profiles, lists and SmartFlows(TM)',
    color: '#047A95',
    annualMonthlyPrice: 30,
    annualPrice: 360,
    monthlyPrice: 35,
    subscriptionPlan: SubscriptionPlan.PREMIUM,
    isFreeTrialPlan: true,
    mostPopular: true,
    showNewHeader: false,
    featuresDescription: 'Everything in Basic, plus:',
    features: [
      'Unlimited SmartFlows(TM)',
      'Configurable task elements',
      'Configurable list columns',
      'Configurable patient lists',
      'Configurable patient profiles',
      'Custom statuses',
      'Teams/multi-user groups',
      'Dock analytics dashboard',
      'Calendar view',
    ],
    comingSoonFeatures: [],
    disclaimers: [],
  },
  {
    key: SubscriptionPlan.PRO,
    label: 'Pro',
    description:
      'For teams needing advanced automation, secure chat and closing-the-loop functionality',
    color: '#5a71f2',
    annualMonthlyPrice: 40,
    annualPrice: 480,
    monthlyPrice: 50,
    subscriptionPlan: SubscriptionPlan.PRO,
    isFreeTrialPlan: true,
    mostPopular: false,
    showNewHeader: true,
    featuresDescription: 'Everything in Premium, plus',
    features: [
      'Dock Chat',
      'Email from a task',
      'SMS from a task',
      'Fax from a task*',
      'eSign documents from a task*',
      'Advanced integrations',
      'Advanced automations',
      'EHR-based event-triggers',
      'Enhanced support and implementation',
    ],
    comingSoonFeatures: [],
    disclaimers: ['*Requires third-party source'],
  },
  {
    key: SubscriptionPlan.ENTERPRISE,
    label: 'Enterprise',
    description:
      'For teams with engineering resources requiring deep integrations and customization',
    color: '#000000',
    subscriptionPlan: SubscriptionPlan.ENTERPRISE,
    selectable: false,
    isPlanTriisFreeTrialPlan: false,
    mostPopular: false,
    showNewHeader: false,
    featuresDescription: 'Everything in Pro, plus:',
    features: [
      'Custom integrations & automations',
      'FHIR-based restful API access',
      'Webhooks',
      'White-label & iFrames',
      'Embedded widgets',
      'Dedicated Slack channel',
      '24/7 support',
      'Custom Tableau dashboard',
      'Unlimited Dock Lite users',
    ],
    comingSoonFeatures: [],
    disclaimers: [],
  },
];

export const DockLite = {
  key: 'DOCK_LITE',
  label: 'Dock Lite',
  description: 'HIPAA-compliant task management with Dock Chat for web and iOS',
  color: '#0e244a',
  annualMonthlyPrice: 7,
  annualPrice: 84,
  monthlyPrice: 10,
  subscriptionPlan: 'DOCK_LITE',
  isFreeTrialPlan: true,
  mostPopular: false,
  showNewHeader: false,
  featuresDescription: 'Included with subscription',
  features: [
    'HIPAA-compliant task-management for outside collaborators and limited-use colleagues',
    'Limited experience for organization members and outside collaborators who are not full members of Dock',
    'Access to a single shared list and a personal task list',
    'Complete with Dock Chat for Pro users on web and iOS',
  ],
};

export const ProfessionalServices = [
  {
    key: ServiceAddOns.LEVEL_1,
    label: 'Level 1',
    description:
      'Professional setup for teams looking for standard integrations and some workflow customization',
    price: '$1,000',
    serviceAddOnLevel: ServiceAddOns.LEVEL_1,
    features: [
      '2 weeks of engagement',
      'Up to 4 hours training/consulting',
      '2 SmartFlow/workflow custom designs',
      'Standard EHR integration (patient demographics and SSO, if available): Athenahealth, Elation, Dr. Chrono, Kareo, AdvancedMD',
      'Standard Productivity Tool Integration: IntakeQ, Jotform, Typeform, Gmail, Google Forms',
      '2 automations (from above in any combination)',
    ],
  },
  {
    key: ServiceAddOns.LEVEL_2,
    label: 'Level 2',
    description:
      'Advanced setup for teams looking for custom integrations, advanced workflow design, and weekly onboarding calls',
    price: '$1k - $5k',
    serviceAddOnLevel: ServiceAddOns.LEVEL_2,
    featuresDescription: 'Everything in Level 1, plus',
    features: [
      '4 weeks of engagement',
      'Up to 12 hours training/consulting',
      'Up to 6 SmartFlow/workflow custom designs',
      'Custom EHR integration (must have open APIs or FHIR endpoints)',
      'Up to 2 Standard Productivity Tool Integrations',
      'Custom Productivity Tool Integrations (must have open APIs or FHIR endpoints)',
      'Up to 4 automations (from above in any combination)',
      'Weekly 30- to 60-minute standup meetings during onboarding',
    ],
  },
  {
    key: ServiceAddOns.LEVEL_3,
    label: 'Level 3',
    description:
      'Custom training and onboarding services plus additional automations, and data import and export',
    price: 'Custom',
    serviceAddOnLevel: ServiceAddOns.LEVEL_3,
    featuresDescription: 'Everything in Level 2, plus',
    features: [
      'Up to 3 months of engagement',
      'Custom training/consulting',
      'Additional Integrations',
      'Additional Automations',
      'Custom Data Import/Export',
      'Project Management',
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

export const getSubscriptionPlanLabel = ({ subscription }) =>
  subscription?.subscriptionPlanName;

export const priceFormatter = (price) => {
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
