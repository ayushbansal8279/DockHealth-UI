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
