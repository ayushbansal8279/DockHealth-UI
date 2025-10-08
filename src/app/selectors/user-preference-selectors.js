import { createSelector } from 'reselect';

export const userPreferenceContextStateSelector = (state) =>
  state.userPreferenceState;

export const userPreferenceContextSelector = createSelector(
  userPreferenceContextStateSelector,
  (state) => state,
);

export const userPreferenceSelectedFiltersSelector = createSelector(
  userPreferenceContextStateSelector,
  ({ selectedFilters }) => selectedFilters || {},
);

export const userPreferenceStatusSelector = createSelector(
  userPreferenceContextStateSelector,
  ({ status }) => (status === '' ? '' : status || 'INCOMPLETE'),
);

export const userPreferenceSelectedQuickFilterSelector = createSelector(
  userPreferenceContextStateSelector,
  ({ selectedQuickFilter }) => selectedQuickFilter || {},
);
