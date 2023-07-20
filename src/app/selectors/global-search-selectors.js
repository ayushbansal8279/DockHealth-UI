import { createSelector } from 'reselect';

export const globalSearchStateSelector = (state) => state.globalSearch;

export const isSearchingCompletedTasksSelector = createSelector(
  globalSearchStateSelector,
  ({ isSearchingCompletedTasks }) => isSearchingCompletedTasks,
);

export const searchValueSelector = createSelector(
  globalSearchStateSelector,
  ({ searchValue }) => searchValue,
);

export const isLoadingGlobalSearchSelector = createSelector(
  globalSearchStateSelector,
  ({ isLoading }) => isLoading,
);

export const isLoadingMoreGlobalSearchSelector = createSelector(
  globalSearchStateSelector,
  ({ isLoadingMore }) => isLoadingMore,
);

export const globalSearchListsSelector = createSelector(
  globalSearchStateSelector,
  ({ lists }) => lists,
);

export const searchPerformedSelector = createSelector(
  globalSearchStateSelector,
  ({ searchPerformed }) => searchPerformed,
);

export const globalTaskDetailsSelector = createSelector(
  globalSearchStateSelector,
  (_, taskId) => taskId,
  (details, taskId) => details.tasksMap[taskId],
);
