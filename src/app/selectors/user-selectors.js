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

export const userHasSmartFlowsSelector = createSelector(
  userProfileSelector,
  ({ organizationAvailableFeatures }) =>
    organizationAvailableFeatures?.includes('SMART_FLOWS'),
);

export const userSetupViewListSelector = listIdentifier =>
  createSelector(
    userViewSetupSelector,
    ({ customLists, defaultViewSetup }) =>
      customLists?.[listIdentifier] || defaultViewSetup,
  );

export const userSetupClientViewSelector = createSelector(
  userViewSetupSelector,
  ({ mainSetup }) => mainSetup,
);
