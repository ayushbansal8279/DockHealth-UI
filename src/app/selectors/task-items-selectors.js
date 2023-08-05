import { createSelector } from 'reselect';

export const taskItemsSelector = (state) => state.taskItems;

export const selectedTaskIdentifiersSelector = createSelector(
  taskItemsSelector,
  ({ selectedTaskIdentifiers }) => selectedTaskIdentifiers,
);

export const isTaskItemSelectedSelector = (taskIdentifier) =>
  createSelector(taskItemsSelector, ({ selectedTaskIdentifiers }) =>
    selectedTaskIdentifiers?.includes(taskIdentifier),
  );
