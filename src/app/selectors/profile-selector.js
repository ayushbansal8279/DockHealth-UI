import { createSelector } from 'reselect';

export const ProfileStateSelector = (state) => state.profile;

export const currentProfileIdentifierSelector = createSelector(
  ProfileStateSelector,
  ({ currentProfileIdentifier }) => currentProfileIdentifier,
);