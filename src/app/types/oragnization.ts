export const AllSubscriptionPlans = [
  'PLAN_STANDARD',
  'PLAN_FREE',
  'PLAN_PREMIUM',
  'PLAN_30_DAY_TRIAL',
  'PLAN_15_DAY_TRIAL',
  'PLAN_ENTERPRISE',
] as const;
type TSubscriptionPlansTuple = typeof AllSubscriptionPlans;
export type TSubscriptionPlan = TSubscriptionPlansTuple[number];

export interface TSubscriptoinDetails {
  subscriptionPlan: TSubscriptionPlan;
  subscriptionPlanName: string;
  billingFrequency: string | null;
  trialEndDate: string;
  trialEnded: boolean | null;
  professionalServicesIncluded: any | null;
}

export interface TOrganization {
  organizationId: number;
  organizationIdentifier: string;
  organizationName: string;
  organizationInitials: string;
  organizationProfileColor: string;
  organizationLegalEntityName: string | null;
  subscriptionDetails: TSubscriptoinDetails;
  baaSigned: boolean;
  baaSignatureRequestSent: boolean;
  baaSignatureDateTime: string;
  referralCode: string | null;
  updatedByUser: boolean;
  emrIntegrationEnabled: boolean;
  emrIntegrationType: string | null;
  customerType: string;
  availableFeatures: string[];
  disabledFeatures: string[];
  showDefaultTaskStatusCompleted: boolean;
  dockChatDisabled: boolean;
  whiteLabelEnabled: any | null;
  emrPatientLink: any | null;
  themeSettings: any | null;
}
