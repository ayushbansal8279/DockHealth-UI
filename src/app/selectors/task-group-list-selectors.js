import { createSelector } from 'reselect';

export const tasksGroupsSelector = state => state.taskGroupList;
export const tasksGroupsIsFetchingSelector = createSelector(
  tasksGroupsSelector,
  ({ isFetching }) => isFetching,
);

export const tasksGroupsIsInitializedSelector = createSelector(
  tasksGroupsSelector,
  ({ listInitialized }) => listInitialized,
);

export const tasksGroupListSelector = createSelector(
  tasksGroupsSelector,
  ({ groupList }) => groupList,
);
