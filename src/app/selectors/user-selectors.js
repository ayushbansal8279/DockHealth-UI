import { createSelector } from 'reselect';

export const userStateSelector = state => state.userState;
export const userViewSetupSelector = state => state.userState.userViewSetup;

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

export const userHasPostEMRNoteFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('POST_EMR_NOTE'),
);

export const userHasBoardVieweFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('BOARD_VIEW'),
);

export const userHasShareTaskFeatureSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SHARE_TASK'),
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
