import axios from 'axios';
import * as ActionTypes from '../actions/action-types';

export function getAllPatients() {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getAllPatients?active=true')
    .then(response => {
      return response.data;
    });
}

export function getPatientsByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getPatientsByTaskList/'+taskListId)
    .then(response => {
      return response.data;
    });
}

export function getPatientById(patientId) {
  if(!patientId){
    patientId = -1;
  }
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/'+patientId)
    .then(response => {
      return response.data;
    });
}

export function removePatient(patientId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'patient/' + patientId)
    .then(response => {
      return response;
    });
}

export function addPatient(patient) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'patient', patient)
    .then(response => {
      return response.data;
    });
}

export function updatePatient(patient) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'patient', patient)
    .then(response => {
      return response.data;
    });
}

export function addPatientToTask(patientId, taskId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL + 'patient/addPatientToTaskById/' + taskId + '?patientId=' + patientId)
    .then(response => {
      return response.data
    })
}

export function lookupEMRPatients(searchToken) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/lookupEMRPatients?searchToken='+searchToken)
    .then(response => {
      return response.data;
    });
}