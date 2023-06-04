import { createSelector } from 'reselect';

export const patientsStateSelector = state => state.patients;

export const defaultPatientsListsSelector = createSelector(
  patientsStateSelector,
  ({ defaultPatientsLists }) => defaultPatientsLists,
);

export const customPatientsListsSelector = createSelector(
  patientsStateSelector,
  ({ customPatientsLists }) => customPatientsLists,
);

export const isFetchingPatientsListsSelector = createSelector(
  patientsStateSelector,
  ({ isFetching }) => isFetching,
);

export const currentPatientsListIdentifierSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsListIdentifier }) => currentPatientsListIdentifier,
);

export const isFetchingPatientsListDetailsSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) =>
    currentPatientsList?.isFetchingListDetails || false,
);

export const patientsListSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList,
);

export const patientsListDetailsSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.listDetails || null,
);

export const patientsSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.patients || null,
);

export const isFetchingPatientsSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.isFetchingPatients || false,
);

export const filterOptionsSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.filterOptions || null,
);

export const patientsListSearchPerformedSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.searchPerformed,
);

export const patientsListSearchTermSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.searchTerm || '',
);

export const patientsSelectedFiltersSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => currentPatientsList?.selectedFilters,
);

export const filtersActiveSelector = createSelector(
  patientsStateSelector,
  ({ currentPatientsList }) => !!currentPatientsList?.selectedFilters,
);
