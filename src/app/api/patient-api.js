import axios from 'axios';
import * as ActionTypes from '../actions/action-types';

export function getAllPatients() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getAllPatientsByOrganizationId/1?active=true')
    .then(response => {
      // store.dispatch({type: ActionTypes.GET_PATIENTS_SUCCESS, patients: response.data});
      return response.data;
    });
}

export function getPatientsByTaskList() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getPatientsByTaskList/1')
    .then(response => {
      // store.dispatch({type: ActionTypes.GET_PATIENTS_SUCCESS, patients: response.data});
      return response.data;
    });
}

export function removePatient(patientId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'patient/' + patientId)
    .then(response => {
      // store.dispatch({type: ActionTypes.DELETE_PATIENT_SUCCESS, patientId: patientId});
      return response;
    });
}

export function addPatient(patient) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'patient?organizationId=1', patient)
    .then(response => {
      // store.dispatch({type: ActionTypes.ADD_PATIENT, patient: response.data});
      return response;
    });
}

export function addPatientToTask(patientId, taskId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL + 'patient/addPatientToTaskById/' + taskId + '?patientId=' + patientId)
    .then(response => {
      return response.data
    })
}
