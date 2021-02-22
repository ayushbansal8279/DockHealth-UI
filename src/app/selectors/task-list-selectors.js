import { createSelector } from 'reselect';

export const taskListStateSelector = state => state.taskList;

export const taskListsSelector = createSelector(
  taskListStateSelector,
  ({ taskLists }) => taskLists,
);

export const taskListMembersSelector = createSelector(
  taskListStateSelector,
  ({ tasklistmembers }) => tasklistmembers,
);
