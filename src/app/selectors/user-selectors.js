import { createSelector } from 'reselect';
import { SubscriptionPlan } from 'helpers/subscription-helper';
import { featureSelector } from './selector-helper';

export const userStateSelector = (state) => state.userState;
export const userViewSetupSelector = (state) => state.userState.userViewSetup;

export const userProfileSelector = createSelector(
  userStateSelector,
  ({ userProfile }) => userProfile || {},
);

export const isFetchingProfileSelector = createSelector(
  userStateSelector,
  ({ isFetchingProfile }) => isFetchingProfile || {},
);

export const userOrganizationsSelector = createSelector(
  userProfileSelector,
  ({ userOrganizations }) => userOrganizations,
);

export const userPreferencesSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.listDisplayColumns,
);

export const OrganizationWidthFieldsPreferencesSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.listDisplayColumnPrefs,
);

export const dashboardGroupsPreferencesSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.displayGroups,
);

export const userHasSmartFlowsSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SMART_FLOWS',
    ),
);

export const userHasUserGroupsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'USER_GROUPS',
    ),
);

export const userHasPatientCustomListsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'PATIENT_CUSTOM_LISTS',
    ),
);

export const userHasPatientCustomFieldsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'PATIENT_CUSTOM_FIELDS',
    ),
);

export const userHasTaskCustomFieldsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'TASK_CUSTOM_FIELDS',
    ),
);

export const userHasSendEmailFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SEND_COMM_EMAIL',
    ),
);

export const userHasSendFaxFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SEND_COMM_FAX',
    ),
);

export const userHasCalenderViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'CALENDAR_VIEW',
    ),
);

export const userHasSendSmsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SEND_COMM_SMS',
    ),
);

export const userHasSendSecureMessageFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SEND_COMM_SECURE_MSG',
    ),
);

export const userHasSendESignFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SEND_COMM_ESIGN',
    ),
);

export const userHasPostEMRNoteFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'POST_EMR_NOTE',
    ),
);

export const userHasShareTaskFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SHARE_TASK',
    ),
);

export const userHasDockChatFeatureSelector = createSelector(
  userProfileSelector,
  () =>
    // ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    //   featureSelector(
    //     organizationAvailableFeatures,
    //     userAvailableFeatures,
    //     'DOCK_CHAT',
    //   )
    false,
);

export const userHasBoardViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'BOARD_VIEW',
    ),
);

export const userHasViewOnlyFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'VIEW_ONLY',
    ),
);

export const userHasDockGuestFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'DOCK_GUEST',
    ),
);

// export const userHasDockLiteFeatureSelector = createSelector(
//   userProfileSelector,
//   ({ organizationAvailableFeatures }) =>
//     organizationAvailableFeatures?.includes('DOCK_LITE'),
// );

export const userHasCustomProfilesFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'CUSTOM_PROFILES',
    ),
);

export const userHasMultiOrgViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'MULTI_ORG_VIEW',
    ),
);

export const userHasAiSummaryViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'AI_SUMMARY',
    ),
);

export const userHasProfileBuilderFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'PROFILE_BUILDER',
    ),
);

export const userHasPatientTimelineFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'PATIENT_TIMELINE',
    ),
);

export const userHasShareTaskWorkflowFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'SHARE_WORKFLOW',
    ),
);

export const userHasAutomationMeteringFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'AUTOMATION_METERING',
    ),
);

export const userHasWorkspacesFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'WORKSPACES',
    ),
);

export const userHasConfigIntegrationsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'CONFIG_INTEGRATIONS',
    ),
);

export const userHasConfigInboundEmailsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures, userAvailableFeatures }) =>
    featureSelector(
      organizationAvailableFeatures,
      userAvailableFeatures,
      'CONFIG_INBOUND_EMAILS',
    ),
);

export const userSetupClientViewSelector = createSelector(
  userViewSetupSelector,
  ({ mainSetup }) => mainSetup,
);

export const selectedUserOrganizationSelector = createSelector(
  userProfileSelector,
  ({ userOrganizations, organizationIdentifier: selectedOrgIdentifier }) =>
    userOrganizations?.find(
      ({ organizationIdentifier }) =>
        organizationIdentifier === selectedOrgIdentifier,
    ) || null,
);

export const userSubscriptionIsStandardSelector = createSelector(
  userProfileSelector,
  ({ subscription }) =>
    subscription?.subscriptionPlan === SubscriptionPlan.STANDARD,
);

export const userSubscriptionIsPremiumSelector = createSelector(
  userProfileSelector,
  ({ subscription }) =>
    subscription?.subscriptionPlan === SubscriptionPlan.PREMIUM,
);

export const userSubscriptionIsProSelector = createSelector(
  userProfileSelector,
  ({ subscription }) => subscription?.subscriptionPlan === SubscriptionPlan.PRO,
);

export const userSubscriptionIsEnterpriseSelector = createSelector(
  userProfileSelector,
  ({ subscription }) =>
    subscription?.subscriptionPlan === SubscriptionPlan.ENTERPRISE,
);
