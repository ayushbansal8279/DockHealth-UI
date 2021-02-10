import { createSelector } from 'reselect';

export const listTasksSelector = state => state.listDetails;

export const tasksIsFetchingSelector = createSelector(
  listTasksSelector,
  ({ isFetching }) => isFetching,
);

export const completedTasksSelector = createSelector(
  listTasksSelector,
  ({ completedTasks }) => completedTasks,
);

export const completedTasksIsFetchingSelector = createSelector(
  listTasksSelector,
  ({ isCompletedTasksFetching }) => isCompletedTasksFetching,
);
export const completedTasksIsFetchingMoreSelector = createSelector(
  listTasksSelector,
  ({ isFetchingMoreTasks }) => isFetchingMoreTasks,
);

export const tasksSelector = createSelector(
  listTasksSelector,
  ({ tasks }) => tasks,
);

export const groupTasksSelector = createSelector(
  listTasksSelector,
  ({ groupedTasks }) => {
    if (!groupedTasks) {
      return {};
    }
    const groupedTasksMap = {};

    // eslint-disable-next-line no-unused-expressions
    groupedTasks?.taskGroups?.forEach(taskGroup => {
      groupedTasksMap[taskGroup.groupIdentifier] = {
        tasks: taskGroup.tasks,
        hasMore: taskGroup.hasMore,
        isLoadingGroup: taskGroup.isLoadingGroup,
        isFetchingMoreTasks: taskGroup.isFetchingMoreTasks,
      };
    });

    return groupedTasksMap;
  },
);

export const groupCompletedTasksSelector = createSelector(
  listTasksSelector,
  ({ completedGroupedTasks }) => completedGroupedTasks?.taskGroups?.[0],
);

export const isFetchingGroupsSelector = createSelector(
  listTasksSelector,
  ({ isFetchingGroups }) => isFetchingGroups,
);

export const areGroupsInitialized = createSelector(
  listTasksSelector,
  ({ groupsInitialized }) => groupsInitialized,
);

export const listDetailsGroupsSelector = createSelector(
  listTasksSelector,
  ({ listGroups }) => listGroups,
);

export const taskDetailsSortSelector = createSelector(
  listTasksSelector,
  ({ sort }) => sort,
);
