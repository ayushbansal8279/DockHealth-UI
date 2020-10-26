import { createSelector } from 'reselect';

export const listDetailsSelector = state => state.listDetails;

export const isFetchingGroupsSelector = createSelector(
  listDetailsSelector,
  ({ isFetchingGroups }) => isFetchingGroups,
);

export const areGroupsInitialized = createSelector(
  listDetailsSelector,
  ({ groupsInitialized }) => groupsInitialized,
);

export const listDetailsGroupsSelector = createSelector(
  listDetailsSelector,
  ({ listGroups }) => listGroups,
);
