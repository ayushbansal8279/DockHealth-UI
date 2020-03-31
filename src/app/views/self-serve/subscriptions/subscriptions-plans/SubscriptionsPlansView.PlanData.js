import palette from '../../../../palette';
import { CARD_TYPES } from './SubscriptionsPlansView.PlanCard';

export const SUBSCRIPTION_PLAN_KEYS = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const subscriptionPlanData = [
  {
    key: SUBSCRIPTION_PLAN_KEYS.STANDARD,
    planLabel: 'Dock',
    inactiveBackgroundColor: palette.unknownGrey6,
    annualMonthlyPrice: 15,
    monthlyPrice: 20,
    cardType: CARD_TYPES.STANDARD,
    subscriptionPlan: 'PLAN_STANDARD',
    isFreeTrialPlan: true,
  },
  {
    key: SUBSCRIPTION_PLAN_KEYS.ENTERPRISE,
    planLabel: 'Custom/Enterprise',
    inactiveBackgroundColor: palette.unknownGrey6,
    cardType: CARD_TYPES.ENTERPRISE,
    subscriptionPlan: 'PLAN_ENTERPRISE',
    selectable: false,
  },
];

export const subscriptionFeatures = [
  {
    key: 'create-tasks',
    label: 'Create tasks with patient context',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'add-subtasks',
    label: 'Add Subtasks',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'team-commenting',
    label: 'Team commenting',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'assign-tasks',
    label: 'Assign/reassign tasks',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'due-dates',
    label: 'Add due dates',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'task-flag-status',
    label: 'Flag & set task status',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'duplicate-tasks',
    label: 'Duplicate tasks',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'multiple-lists',
    label: 'Create multiple lists',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'history-of-events',
    label: 'View history of events',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'email-forwarding',
    label: 'Forward email to your task lists',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
  },
  {
    key: 'attachments',
    label: 'Add Attachments',
    subscriptionTypes: [CARD_TYPES.STANDARD, CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: null,
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
    key: 'modify-baa',
    label: 'Modify BAA',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
  {
    key: 'single-sign-on',
    label: 'Single sign-on',
    subscriptionTypes: [CARD_TYPES.ENTERPRISE],
    subscriptionTypeExtendedIn: CARD_TYPES.ENTERPRISE,
  },
];
