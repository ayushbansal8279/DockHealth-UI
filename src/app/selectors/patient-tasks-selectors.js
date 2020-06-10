import { createSelector } from 'reselect';

export const patientTasksStateSelector = state => state.patientTasks;

export const patientTaskListsSelector = createSelector(
  patientTasksStateSelector,
  ({ lists }) => lists,
);
