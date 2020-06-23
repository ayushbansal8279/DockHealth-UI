import { createSelector } from 'reselect';

export const taskListStateSelector = state => state.taskListState;

export const taskListSelector = createSelector(
  taskListStateSelector,
  ({ tasklist }) => tasklist,
);

export const taskListMembersSelector = createSelector(
  taskListStateSelector,
  ({ tasklistmembers }) => tasklistmembers,
);

export const membersNotInTaskListSelector = createSelector(
  taskListStateSelector,
  ({ orgusersnotintasklist }) => orgusersnotintasklist,
);

export const listsSelector = createSelector(
  taskListStateSelector,
  ({ tasklist }) => tasklist,
);
