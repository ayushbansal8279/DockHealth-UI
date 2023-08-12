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

export const isTaskItemsSelectedSelector = (taskIdentifiers) =>
  createSelector(
    taskItemsSelector,
    ({ selectedTaskIdentifiers }) =>
      taskIdentifiers &&
      taskIdentifiers?.length > 0 &&
      taskIdentifiers?.every((taskId) =>
        selectedTaskIdentifiers?.includes(taskId),
      ),
  );
