import { createSelector } from 'reselect';

export const userStateSelector = state => state.userState;

export const userSelector = createSelector(
  userStateSelector,
  ({ user }) => user,
);

export const userProfileSelector = createSelector(
  userStateSelector,
  ({ userProfile }) => userProfile || {},
);

export const userProfilePictureSelector = createSelector(
  userStateSelector,
  ({ userProfilePic }) => userProfilePic,
);

export const userOrganizationsSelector = createSelector(
  userProfileSelector,
  ({ userOrganizations }) => userOrganizations,
);

export const userProfileDashboardPrefsSelector = createSelector(
  userProfileSelector,
  ({ userPreference }) => userPreference?.displayColumns,
);
