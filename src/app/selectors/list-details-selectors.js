import { createSelector } from 'reselect';
import prop from 'ramda/src/prop';

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

export const searchTermSelector = createSelector(
  listTasksSelector,
  ({ searchTerm }) => searchTerm,
);

export const groupTasksSelector = createSelector(
  listTasksSelector,
  ({ groupedTasks }) => {
    return groupedTasks?.taskGroups;
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

export const taskCountersSelector = createSelector(
  listTasksSelector,
  ({ taskCounters }) => taskCounters,
);

export const listCustomFieldsSelector = createSelector(
  listTasksSelector,
  prop('listCustomFields'),
);
