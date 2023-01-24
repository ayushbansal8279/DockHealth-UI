import { createSelector } from 'reselect';

export const dashboardTasksStateSelector = (state) => state.dashboardTasks;

export const dashboardTasksSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tasksList }) => tasksList,
);

export const dashboardSearchValueSelector = createSelector(
  dashboardTasksStateSelector,
  ({ searchValue }) => searchValue,
);

export const dashboardLastCreatedTaskIdentifierSelector = createSelector(
  dashboardTasksStateSelector,
  ({ lastCreatedTaskIdentifier }) => lastCreatedTaskIdentifier,
);

export const dashboardTasksIsLoadingSelector = createSelector(
  dashboardTasksStateSelector,
  ({ isLoading }) => isLoading,
);

export const dashboardGroupTasksCountSelector = createSelector(
  dashboardTasksStateSelector,
  (_, groupType) => groupType,
  ({ tasksList }, groupType) => {
    const group = tasksList?.find((g) => g.groupType === groupType);
    return group?.tasks?.length || 0;
  },
);

export const dashboardAllTaskItemsSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tasksList }) => tasksList?.flatMap((l) => l?.tasks || []) || [],
);

export const dashboardTabNameSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tabName }) => tabName,
);

export const dashboardSelectedFiltersSelector = createSelector(
  dashboardTasksStateSelector,
  ({ selectedFilters }) => selectedFilters,
);

export const dashboardFilterOptionsSelector = createSelector(
  dashboardTasksStateSelector,
  ({ filterOptions }) => filterOptions,
);

export const isFetchingDashboardFiltersSelector = createSelector(
  dashboardTasksStateSelector,
  ({ isFetchingFilters }) => isFetchingFilters,
);
