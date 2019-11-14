import axios from './axios-heydoc';
import { fixList } from '../helpers/inbox-fix';

export function getAllPatients() {
  return axios
    .get('patient/getAllPatients?active=true')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getMyPatientsAll() {
  return axios
    .get('patient/getPatientsForCurrentUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getMyPatientsActive() {
  return axios
    .get('patient/getPatientsForCurrentUser?taskStatus=INCOMPLETE')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getPatientsByTaskList(taskListId) {
  return axios
    .get(`patient/getPatientsByTaskList/${taskListId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getPatientById(patientId) {
  return axios
    .get(`patient/${patientId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error.response.data;
    });
}

export function removePatient(patientId) {
  return axios
    .delete(`patient/${patientId}`)
    .then(response => response)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function addPatient(patient) {
  return axios
    .post('patient', patient)
    .then(response => {
      toggleAlert('Patient added successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in adding patient. Please try again.', 'error');
      throw error.response.data;
    });
}

export function updatePatient(patient) {
  return axios
    .put('patient', patient)
    .then(response => {
      toggleAlert('Patient updated successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating patient. Please try again.', 'error');
      return error.response.data;
    });
}

export function addPatientToTask(patientId, taskId) {
  return axios
    .put(`patient/addPatientToTaskById/${taskId}?patientId=${patientId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function lookupEMRPatients(searchToken) {
  return axios
    .get(`patient/lookupEMRPatients?searchToken=${searchToken}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

// This api call 'patient/deletePatient/' does not exist yet
export function deletePatient(patientId) {
  return axios
    .get(`patient/deletePatient/${patientId}`)
    .then(response => response)
    .catch(error => {
      console.log(error);
    });
}

/**
 * Find Tasks that are related to a Patient for the Inbox and Lists that User is part of
 * @param {number} patientId
 * @param {('COMPLETE'|'INCOMPLETE')} status
 * @returns {Promise}
 */
export const findUserTasksByPatient = (patientId, status) =>
  axios
    .get(`/task/findUserTasksByPatient/${patientId}?status=${status}`)
    .then(response => {
      return fixList(response.data);
    })
    .catch(error => {
      console.error(error);
      throw error.response.data;
    });

export const createPatientNote = (patientId, note) =>
  axios
    .post(`/patient/note/${patientId}`, note)
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });

export const updatePatientNote = note =>
  axios
    .put('/patient/note', note)
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });

export const deletePatientNote = patientNoteId =>
  axios
    .delete(`/patient/note/deletePatientNoteById/${patientNoteId}`)
    .then(response => response.data)
    .catch(error => {
      throw error.response.data;
    });
