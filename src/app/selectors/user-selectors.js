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
