import { createSelector } from 'reselect';

export const dashboardStatisticsStateSelector = state =>
  state.dashboardStatistics;

export const dashboardStatisticsSelector = createSelector(
  dashboardStatisticsStateSelector,
  ({ statistics }) => statistics,
);

export const dashboardStatisticsIsLoadingSelector = createSelector(
  dashboardStatisticsStateSelector,
  ({ isLoading }) => isLoading,
);
