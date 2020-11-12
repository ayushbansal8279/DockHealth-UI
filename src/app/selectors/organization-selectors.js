import { createSelector } from 'reselect';

export const organizationStateSelector = state => state.organizationState;

export const organizationSelector = createSelector(
  organizationStateSelector,
  ({ organization }) => organization,
);
