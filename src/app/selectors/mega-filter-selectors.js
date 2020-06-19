import { createSelector } from 'reselect';
import { isEmpty } from 'ramda';

export const megaFilterStateSelector = state => state.megaFilter;

export const megaFilterSelector = createSelector(
  megaFilterStateSelector,
  megaFilter => megaFilter,
);

export const selectedFiltersInMegaFilterSelector = createSelector(
  megaFilterStateSelector,
  ({ selectedFilters }) => selectedFilters,
);

export const availableFiltersInInMegaFilterSelector = createSelector(
  megaFilterStateSelector,
  ({ filters }) => filters,
);

export const hasFiltersAppliedSelector = createSelector(
  megaFilterStateSelector,
  ({ selectedFilters }) => !isEmpty(selectedFilters),
);
