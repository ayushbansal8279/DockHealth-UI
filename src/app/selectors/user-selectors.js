import { createSelector } from 'reselect';
import { SubscriptionPlan } from 'helpers/subscription-helper';

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
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SMART_FLOWS'),
);

export const userHasUserGroupsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('USER_GROUPS'),
);

export const userHasPatientCustomListsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('PATIENT_CUSTOM_LISTS'),
);

export const userHasPatientCustomFieldsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('PATIENT_CUSTOM_FIELDS'),
);

export const userHasTaskCustomFieldsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('TASK_CUSTOM_FIELDS'),
);

export const userHasSendEmailFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SEND_COMM_EMAIL'),
);

export const userHasSendFaxFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SEND_COMM_FAX'),
);

export const userHasSendSmsFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SEND_COMM_SMS'),
);

export const userHasSendSecureMessageFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SEND_COMM_SECURE_MSG'),
);

export const userHasSendESignFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SEND_COMM_ESIGN'),
);

export const userHasPostEMRNoteFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('POST_EMR_NOTE'),
);

export const userHasShareTaskFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SHARE_TASK'),
);

export const userHasDockChatFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('DOCK_CHAT'),
);

export const userHasBoardViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('BOARD_VIEW'),
);

export const userHasViewOnlyFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('VIEW_ONLY'),
);

export const userHasDockGuestFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('DOCK_GUEST'),
);

// export const userHasDockLiteFeatureSelector = createSelector(
//   userProfileSelector,
//   ({ organizationAvailableFeatures }) =>
//     organizationAvailableFeatures?.includes('DOCK_LITE'),
// );

export const userHasCustomProfilesFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('CUSTOM_PROFILES'),
);

export const userHasMultiOrgViewFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('MULTI_ORG_VIEW'),
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
