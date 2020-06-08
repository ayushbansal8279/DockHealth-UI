import { createSelector } from 'reselect';

export const patientTasksStateSelector = state => state.patientTasks;

export const patientTaskListsSelector = createSelector(
  patientTasksStateSelector,
  ({ lists }) => lists,
);

export const patientTaskListsActiveTabSelector = createSelector(
  patientTasksStateSelector,
  ({ activeTab }) => activeTab,
);

export const patientTasksSelector = createSelector(
  patientTasksStateSelector,
  patientTasks => patientTasks,
);
