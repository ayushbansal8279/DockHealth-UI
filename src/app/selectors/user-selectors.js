import { createSelector } from 'reselect';

export const userStateSelector = state => state.userState;

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

export const userHasSmartFlowsSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SMART_FLOWS'),
);
