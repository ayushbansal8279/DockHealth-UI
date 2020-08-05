import { createSelector } from 'reselect';

export const userStateSelector = state => state.userState;

export const userSelector = createSelector(
  userStateSelector,
  ({ user }) => user,
);

export const userProfileSelector = createSelector(
  userStateSelector,
  ({ userProfile }) => userProfile,
);

export const userProfileDashbaordPrefsSelector = createSelector(
  userProfileSelector,
  ({ userPreference }) => userPreference?.displayColumns?.[0],
);
