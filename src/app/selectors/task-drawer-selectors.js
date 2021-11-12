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

export const taskCustomFieldsSelector = createSelector(
  taskDrawerSelector,
  ({ customFields }) => customFields,
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
  ({ selectedTask }) =>
    selectedTask &&
    selectedTask.parentTaskIdentifier &&
    !selectedTask.taskIdentifier,
);

export const addingNewSubtaskParentIdSelector = createSelector(
  taskDrawerSelector,
  ({ selectedTask }) => selectedTask?.parentTaskIdentifier || null,
);

export const taskDrawerOpenSelector = createSelector(
  taskDrawerSelector,
  ({ open }) => open,
);

export const taskDrawerFocusFieldSelector = createSelector(
  taskDrawerSelector,
  ({ focusField }) => focusField,
);
