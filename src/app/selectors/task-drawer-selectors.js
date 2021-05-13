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

export const addingNewSubtaskSelector = createSelector(
  taskDrawerSelector,
  ({ addingNewSubtask }) => addingNewSubtask,
);

export const subtaskShapeSelector = createSelector(
  taskDrawerSelector,
  ({ subtaskShape }) => subtaskShape,
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
