import { createSelector } from 'reselect';

export const taskDrawerSelector = state => state.taskDrawerState;

export const selectedTaskSelector = createSelector(
  taskDrawerSelector,
  ({ selectedTask }) => selectedTask,
);

export const taskIsSelectedSelector = createSelector(
  taskDrawerSelector,
  ({ selectedTask }) => !!selectedTask,
);

export const selectedTaskIdentifierSelector = createSelector(
  taskDrawerSelector,
  ({ selectedTask }) => selectedTask?.taskIdentifier,
);

export const isTaskSelectedSelector = (
  taskIdentifier,
  isSelectedByHighlighted,
) =>
  createSelector(
    taskDrawerSelector,
    ({ selectedTask }) =>
      selectedTask?.taskIdentifier === taskIdentifier ||
      isSelectedByHighlighted,
  );

export const addingNewSubtaskSelector = createSelector(
  taskDrawerSelector,
  ({ addingNewSubtaskParentId }) => !!addingNewSubtaskParentId,
);

export const addingNewSubtaskParentIdSelector = createSelector(
  taskDrawerSelector,
  ({ addingNewSubtaskParentId }) => addingNewSubtaskParentId,
);

export const taskDrawerOpenSelector = createSelector(
  taskDrawerSelector,
  ({ open }) => open,
);

export const taskDrawerFocusFieldSelector = createSelector(
  taskDrawerSelector,
  ({ focusField }) => focusField,
);
