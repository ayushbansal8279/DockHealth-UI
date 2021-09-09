import { createSelector } from 'reselect';

export const taskListStateSelector = state => state.taskList;

export const taskListsSelector = createSelector(
  taskListStateSelector,
  ({ taskLists }) => taskLists,
);
export const pendingTaskListsSelector = createSelector(
  taskListStateSelector,
  ({ pendingTaskLists }) => pendingTaskLists,
);

export const taskListMembersSelector = createSelector(
  taskListStateSelector,
  ({ tasklistmembers }) => tasklistmembers,
);

export const archivedTaskListsSelector = createSelector(
  taskListStateSelector,
  ({ archivedTaskLists }) => archivedTaskLists,
);
