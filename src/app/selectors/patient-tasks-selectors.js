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

export const patientListHasTasksSelector = createSelector(
  patientTasksStateSelector,
  ({ lists }) => lists?.length > 0,
);

export const currentPatientIdentifierSelector = createSelector(
  patientTasksStateSelector,
  ({ patientIdentifier }) => patientIdentifier,
);

export const patientTaskSearchSelector = createSelector(
  patientTasksStateSelector,
  ({ taskSearch }) => taskSearch,
);

export const completeTasksCountSelector = createSelector(
  patientTasksStateSelector,
  ({ completeTasksCount }) => completeTasksCount,
);
