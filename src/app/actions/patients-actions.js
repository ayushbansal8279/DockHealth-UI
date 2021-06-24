/* eslint-disable import/prefer-default-export */
/* eslint-disable sonarjs/no-identical-functions */
import * as PatientsApi from 'api/patients-api';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from './action-types';

export function getPatientsLists() {
  return dispatch => {
    dispatch({
      type: ActionTypes.GET_PATIENTS_LISTS_REQUEST,
    });
    return PatientsApi.getPatientsLists()
      .then(patientsLists => {
        dispatch({
          type: ActionTypes.GET_PATIENTS_LISTS_SUCCESS,
          patientsLists,
        });
      })
      .catch(error => {
        throw error;
      });
  };
}

export function deletePatientsList(identifier) {
  return dispatch =>
    PatientsApi.deletePatientsList(identifier)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_PATIENTS_LIST,
          identifier,
        });
        dispatch(showGlobalAlert(AlertMessages.DELETED));
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
      });
}

export function updatePatientsList(identifier, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_PATIENTS_LIST,
    identifier,
    dataToUpdate,
  };
}
