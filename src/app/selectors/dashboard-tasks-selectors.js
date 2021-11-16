import { createSelector } from 'reselect';

export const dashboardTasksStateSelector = state => state.dashboardTasks;

export const dashboardTasksSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tasksList }) => tasksList,
);

export const dashboardTasksIsLoadingSelector = createSelector(
  dashboardTasksStateSelector,
  ({ isLoading }) => isLoading,
);

export const dashboardGroupTasksCountSelector = createSelector(
  dashboardTasksStateSelector,
  (_, groupType) => groupType,
  ({ tasksList }, groupType) => {
    const group = tasksList?.find(g => g.groupType === groupType);
    return group?.tasks?.length || 0;
  },
);

export const dashboardAllTaskItemsSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tasksList }) => tasksList?.flatMap(l => l?.tasks || []) || [],
);

export const dashboardTabNameSelector = createSelector(
  dashboardTasksStateSelector,
  ({ tabName }) => tabName,
);
