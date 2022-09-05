import isEmpty from 'ramda/src/isEmpty';
import { createSelector } from 'reselect';

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
  ({ selectedFilters }) => !!selectedFilters && !isEmpty(selectedFilters),
);

export const isFetchingFiltersSelector = createSelector(
  megaFilterSelector,
  ({ isLoading }) => isLoading,
);

export const quickFiltersSelector = createSelector(
  megaFilterSelector,
  ({ quickFilters }) => quickFilters,
);

export const addQuickFilterOptionSelector = createSelector(
  megaFilterSelector,
  ({ addQuickFilterOption }) => addQuickFilterOption,
);

export const selectedQuickFilterSelector = createSelector(
  megaFilterSelector,
  ({ selectedQuickFilter }) => selectedQuickFilter,
);
