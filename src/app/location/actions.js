/* eslint-disable import/prefer-default-export */
import { SET_LOCATION_PARAMS } from './reducers';

export const setLocationAndParameters = ({ location, params }) => ({
  type: SET_LOCATION_PARAMS,
  location,
  params,
});
