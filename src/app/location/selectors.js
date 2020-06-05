import { createSelector } from 'reselect';

export const locationState = state => state.location;
export const locationSelector = createSelector(
  locationState,
  ({ location }) => location,
);

export const locationParametersSelector = createSelector(
  locationState,
  ({ params }) => params,
);
