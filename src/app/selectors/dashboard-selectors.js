import { createSelector } from 'reselect';

export const dashboardTasksStateSelector = (state) => state.dashboardTasks;

export const dashboardTasksSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tasksList }) => tasksList || [],
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

export const dashboardTaskDetailsSelector = createSelector(
  dashboardTasksStateSelector,
  (_, taskId) => taskId,
  (dashboardTasks, taskId) => dashboardTasks.tasksMap[taskId],
);

export const dashboardMultipleTaskDetailsSelector = createSelector(
  dashboardTasksStateSelector,
  (_, taskIds) => taskIds,
  (dashboardTasks, taskIds) =>
    taskIds.map((taskId) => dashboardTasks.tasksMap[taskId]),
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

export const selectedTasksSelector = (state) =>
  state?.taskItems?.selectedTaskIdentifiers
    .filter((taskId) => state?.dashboardTasks?.tasksMap[taskId] !== undefined)
    .map((taskId) => state?.dashboardTasks?.tasksMap[taskId]);
