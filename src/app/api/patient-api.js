import { fixList } from 'helpers/inbox-fix';
import axios from './axios-heydoc';

export function getAllPatients() {
  return axios
    .get('patient/getAllPatients?active=true')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getMyPatientsAll() {
  return axios
    .get('patient/getPatientsForCurrentUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getMyPatientsActive() {
  return axios
    .get('patient/getPatientsForCurrentUser?taskStatus=INCOMPLETE')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getPatientsByTaskList(taskListIdentifier) {
  return axios
    .get(`patient/getPatientsByTaskList/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function getPatientById(patientIdentifier) {
  return axios
    .get(`patient/${patientIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function removePatient(patientIdentifier) {
  return axios
    .delete(`patient/${patientIdentifier}`)
    .then(response => response)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function addPatient(patient) {
  return axios
    .post('patient', patient)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in adding patient. Please try again.', 'error');
      throw new Error(error?.response?.data);
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
      throw new Error(error?.response?.data);
    });
}

export function addPatientToTask(patientIdentifier, taskIdentifier) {
  return axios
    .put(
      `patient/addPatientToTaskById/${taskIdentifier}?patientId=${patientIdentifier}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

export function lookupEMRPatients(searchToken) {
  return axios
    .get(`patient/lookupEMRPatients?searchToken=${searchToken}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data);
    });
}

// This api call 'patient/deletePatient/' does not exist yet
export function deletePatient(patientIdentifier) {
  return axios
    .get(`patient/deletePatient/${patientIdentifier}`)
    .then(response => response)
    .catch(error => {
      console.log(error);
    });
}

/**
 * Find Tasks that are related to a Patient for the Inbox and Lists that User is part of
 * @param {number} patientIdentifier
 * @param {('COMPLETE'|'INCOMPLETE')} status
 * @returns {Promise}
 */
export const findUserTasksByPatient = (patientIdentifier, status) =>
  axios
    .get(`/task/findUserTasksByPatient/${patientIdentifier}?status=${status}`)
    .then(response => {
      return fixList(response.data);
    })
    .catch(error => {
      console.error(error);
      throw new Error(error?.response?.data);
    });

export const createPatientNote = (patientIdentifier, note) =>
  axios
    .post(`/patient/note/${patientIdentifier}`, note)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const updatePatientNote = note =>
  axios
    .put('/patient/note', note)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export const deletePatientNote = patientNoteIdentifier =>
  axios
    .delete(`/patient/note/deletePatientNoteById/${patientNoteIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });

export function updatePatientWithoutAlert(patient) {
  return axios
    .put('patient', patient)
    .then(({ data }) => {
      return data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}
export const archivePatient = patientNoteIdentifier =>
  axios
    .delete(`/patient/archivePatient/${patientNoteIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data);
    });
