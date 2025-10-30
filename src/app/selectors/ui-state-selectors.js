import { createSelector } from 'reselect';

export const uiStateSelector = (state) => state.uiState || {};

export const getSubtaskQuickAddOpenState = createSelector(
  [uiStateSelector, (_, taskIdentifier) => taskIdentifier],
  (uiState, taskIdentifier) => {
    const taskUIState = uiState.taskUIState || {};
    return taskUIState[taskIdentifier]?.subtaskQuickAddOpen || false;
  },
);
