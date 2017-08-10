import axios from 'axios';
import * as ActionTypes from '../actions/action-types';

export function getAllPatients() {
  // loading()
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getAllPatients?active=true')
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function getPatientsByTaskList(taskListId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/getPatientsByTaskList/'+taskListId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function getPatientById(patientId) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/'+patientId)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function removePatient(patientId) {
  return axios.delete(process.env.HEYDOC_SERVICES_BASE_URL+'patient/' + patientId)
    .then(response => {
      return response;
    }).catch(function (error){
      console.log(error);
    });
}

export function addPatient(patient) {
  return axios.post(process.env.HEYDOC_SERVICES_BASE_URL+'patient', patient)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function updatePatient(patient) {
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL+'patient', patient)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}

export function addPatientToTask(patientId, taskId){
  return axios.put(process.env.HEYDOC_SERVICES_BASE_URL + 'patient/addPatientToTaskById/' + taskId + '?patientId=' + patientId)
    .then(response => {
      return response.data
    }).catch(function (error){
      console.log(error);
    });
}

export function lookupEMRPatients(searchToken) {
  return axios.get(process.env.HEYDOC_SERVICES_BASE_URL+'patient/lookupEMRPatients?searchToken='+searchToken)
    .then(response => {
      return response.data;
    }).catch(function (error){
      console.log(error);
    });
}
