import { createSelector } from 'reselect';

export const taskListStateSelector = state => state.taskList;

export const taskListsSelector = createSelector(
  taskListStateSelector,
  ({ tasklist }) => tasklist,
);

export const taskListMembersSelector = createSelector(
  taskListStateSelector,
  ({ tasklistmembers }) => tasklistmembers,
);
