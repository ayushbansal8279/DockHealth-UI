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
