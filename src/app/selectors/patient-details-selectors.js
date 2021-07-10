import { createSelector } from 'reselect';

export const patientDetailsStateSelector = state => state.patientDetails;

export const patientTaskListsSelector = createSelector(
  patientDetailsStateSelector,
  ({ lists }) => lists,
);

export const isFetchingPatientTaskListsSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetching }) => isFetching,
);

export const completeTasksVisibilitySelector = createSelector(
  patientDetailsStateSelector,
  ({ completeTasksVisible }) => completeTasksVisible,
);

export const patientListHasTasksSelector = createSelector(
  patientDetailsStateSelector,
  ({ lists }) => lists?.length > 0,
);

export const currentPatientIdentifierSelector = createSelector(
  patientDetailsStateSelector,
  ({ patientIdentifier }) => patientIdentifier,
);

export const patientTaskSearchSelector = createSelector(
  patientDetailsStateSelector,
  ({ taskSearch }) => taskSearch,
);

export const completeTasksCountSelector = createSelector(
  patientDetailsStateSelector,
  ({ completeTasksCount }) => completeTasksCount,
);

export const patientTasksSortSelector = createSelector(
  patientDetailsStateSelector,
  ({ sort }) => sort,
);

export const patientSelector = createSelector(
  patientDetailsStateSelector,
  ({ patient }) => patient,
);

export const patientNotesSelector = createSelector(
  patientDetailsStateSelector,
  ({ patient }) => patient?.allNotes || null,
);

export const isFetchingNotesSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingPatient }) => isFetchingPatient,
);

export const isFetchingPatientSelector = createSelector(
  patientDetailsStateSelector,
  ({ isFetchingPatient }) => isFetchingPatient,
);
