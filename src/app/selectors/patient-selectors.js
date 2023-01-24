import { createSelector } from 'reselect';
import isEmpty from 'ramda/src/isEmpty';

export const patientStateSelector = (state) => state.patient;

export const patientDetailsSelector = createSelector(
  patientStateSelector,
  ({ details }) => details,
);

export const patientIsLoadingSelector = createSelector(
  patientStateSelector,
  ({ isLoading }) => isLoading,
);

export const patientIsInitialyLoadingSelector = createSelector(
  patientStateSelector,
  ({ isLoading, details }) => isLoading && isEmpty(details),
);
