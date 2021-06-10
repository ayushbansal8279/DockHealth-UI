/* eslint-disable import/prefer-default-export */
/* eslint-disable sonarjs/no-identical-functions */
import * as PatientsApi from 'api/patients-api';
import * as ActionTypes from './action-types';

export function getDefaultPatientsLists() {
  return dispatch =>
    PatientsApi.getDefaultPatientsLists()
      .then(defaultPatientsLists => {
        dispatch({
          type: ActionTypes.GET_PATIENTS_LISTS_SUCCESS,
          defaultPatientsLists,
        });
      })
      .catch(error => {
        throw error;
      });
}
