import { createSelector } from 'reselect';

export const patientStateSelector = state => state.patient;

export const patientDetailsSelector = createSelector(
  patientStateSelector,
  ({ details }) => details,
);
