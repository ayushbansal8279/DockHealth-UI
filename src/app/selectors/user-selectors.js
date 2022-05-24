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

export const userProfileDashboardPrefsSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.displayColumns,
);

export const userProfileColumnOrderSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.customFieldDisplayColumns, // TODO: key to change
);

export const userProfileCustomFieldsSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.customFieldDisplayColumns,
);

export const dashboardGroupsOrderPreferencesSelector = createSelector(
  userStateSelector,
  ({ userPreference }) => userPreference?.displayGroups,
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
