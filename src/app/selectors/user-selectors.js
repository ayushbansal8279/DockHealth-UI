import { createSelector } from 'reselect';

export const userStateSelector = state => state.userState;
export const userViewSetupSelector = state => state.userState.userViewSetup;

export const userProfileSelector = createSelector(
  userStateSelector,
  ({ userProfile }) => userProfile || {},
);

export const userOrganizationsSelector = createSelector(
  userProfileSelector,
  ({ userOrganizations }) => userOrganizations,
);

export const userProfileDashboardPrefsSelector = createSelector(
  userProfileSelector,
  ({ userPreference }) => userPreference?.displayColumns,
);

export const userProfileCustomFieldsSelector = createSelector(
  userProfileSelector,
  ({ userPreference }) => userPreference?.customFieldDisplayColumns,
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
