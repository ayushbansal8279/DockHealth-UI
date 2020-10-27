import { createSelector } from 'reselect';

export const taskSelector = state => state.taskState;

export const taskIsSelectedSelector = createSelector(
  taskSelector,
  ({ selectedTask }) => !!selectedTask,
);

export const selectedTaskIdentifierSelector = createSelector(
  taskSelector,
  ({ selectedTask }) => selectedTask?.taskIdentifier,
);
