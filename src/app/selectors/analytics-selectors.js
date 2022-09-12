import prop from 'ramda/src/prop';
import compose from 'ramda/src/compose';
import { createSelector } from 'reselect';

export const analyticsStateSelector = state => state.analytics;

export const analyticsFiltersSelector = createSelector(
  analyticsStateSelector,
  prop('filters'),
);

export const isLoadingAnalyticsFilters = createSelector(
  analyticsStateSelector,
  prop('isLoadingFilters'),
);

export const analyticsSelectedFiltersSelector = createSelector(
  analyticsStateSelector,
  prop('selectedFilters'),
);

export const analyticsFiltersActiveSelector = createSelector(
  analyticsStateSelector,
  compose(Boolean, prop('selectedFilters')),
);
