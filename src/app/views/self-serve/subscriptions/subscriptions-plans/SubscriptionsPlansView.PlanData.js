import { CARD_TYPES } from './SubscriptionsPlansView.PlanCard';

export const SUBSCRIPTION_PLAN_KEYS = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const subscriptionPlanData = [
  {
    key: SUBSCRIPTION_PLAN_KEYS.STANDARD,
    planLabel: 'Standard',
    inactiveBackgroundColor: '#DEDEE2',
    annualMonthlyPrice: 14.25,
    monthlyPrice: 19,
    cardType: CARD_TYPES.STANDARD,
    subscriptionPlan: 'PLAN_STANDARD',
  },
  {
    key: SUBSCRIPTION_PLAN_KEYS.PREMIUM,
    planLabel: 'Premium',
    inactiveBackgroundColor: '#C8C8CE',
    annualMonthlyPrice: 18,
    monthlyPrice: 24,
    cardType: CARD_TYPES.PREMIUM,
    recommended: true,
    subscriptionPlan: 'PLAN_PREMIUM',
  },
  {
    key: SUBSCRIPTION_PLAN_KEYS.ENTERPRISE,
    planLabel: 'Enterprise',
    inactiveBackgroundColor: '#DEDEE2',
    cardType: CARD_TYPES.ENTERPRISE,
    subscriptionPlan: 'PLAN_ENTERPRISE',
    selectable: false,
  },
];

export const subscriptionFeatures = [
  {
    key: 'create-tasks',
    label: 'Create tasks with patient context',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'add-subtasks',
    label: 'Add subtasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'team-commenting',
    label: 'Team commenting',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'assign-tasks',
    label: 'Assign/reassign tasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'due-dates',
    label: 'Add due dates',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'task-flag-status',
    label: 'Flag & set task status',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'duplicate-tasks',
    label: 'Duplicate tasks',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'multiple-lists',
    label: 'Create multiple lists',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'history-of-events',
    label: 'View history of events',
    subscriptionTypes: [
      CARD_TYPES.STANDARD,
      CARD_TYPES.PREMIUM,
      CARD_TYPES.ENTERPRISE,
    ],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'email-forwarding',
    label: 'Forward email to your task lists',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'attachments',
    label: 'Add attachments',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'tags',
    label: 'Customizable tags',
    subscriptionTypes: [CARD_TYPES.PREMIUM, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.PREMIUM,
  },
  {
    key: 'ehr-integration',
    label: 'EHR integration',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-email',
    label: 'Custom email addresses',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-scripts',
    label: 'Custom email scripts/integrations',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'upload-patient-profiles',
    label: 'Uploading of patient profiles',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'custom-protocols',
    label: 'Custom protocols',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'automations-workflows',
    label: 'Event/order driven automations & workflows',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
];
