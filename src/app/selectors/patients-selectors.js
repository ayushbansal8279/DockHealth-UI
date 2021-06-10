import { createSelector } from 'reselect';

export const patientsStateSelector = state => state.patients;

export const defaultPatientsListsSelector = createSelector(
  patientsStateSelector,
  ({ defaultPatientsLists }) => defaultPatientsLists,
);

export const allPatientsStatsSelector = createSelector(
  patientsStateSelector,
  ({ defaultPatientsLists }) =>
    defaultPatientsLists.find(
      pl => pl.listName === 'All Patients' && pl.listType === 'DEFAULT',
    ),
);

export const activePatientsStatsSelector = createSelector(
  patientsStateSelector,
  ({ defaultPatientsLists }) =>
    defaultPatientsLists.find(
      pl => pl.listName === 'Active Patients' && pl.listType === 'DEFAULT',
    ),
);
