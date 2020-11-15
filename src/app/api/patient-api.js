import { fixList } from 'helpers/inbox-fix';
import { noop, showAlert } from 'helpers/utility-functions';

import axios from './axios-heydoc';

export function getAllPatients() {
  return axios
    .get('patient/getAllPatients?active=true')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
export function getSharedPatients() {
  return axios
    .get('patient/getSharedPatients?active=true')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
export function getMyPatientsAll() {
  return axios
    .get('patient/getPatientsForCurrentUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getMyPatientsActive() {
  return axios
    .get('patient/getPatientsForCurrentUser?taskStatus=INCOMPLETE')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getPatientsByTaskList(taskListIdentifier) {
  return axios
    .get(`patient/getPatientsByTaskList/${taskListIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getPatientsByName(searchedPatientName) {
  return axios
    .get(`patient/getPatientsByName?inputStr=${searchedPatientName}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getPatientsByCriteria(seacrhCriteria) {
  return axios
    .get(`patient/getPatientsByCriteria?seacrhCriteria=${seacrhCriteria}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getPatientById(patientIdentifier) {
  return axios
    .get(`patient/${patientIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function removePatient(patientIdentifier) {
  return axios
    .delete(`patient/${patientIdentifier}`)
    .then(response => response)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
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
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error adding patient. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updatePatient(patient) {
  if (patient.dob === '') {
    // eslint-disable-next-line no-param-reassign
    patient.dob = null;
  }
  return axios
    .put('patient', patient)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error updating patient. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
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
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function lookupEMRPatients(searchToken) {
  return axios
    .get(`patient/lookupEMRPatients?searchToken=${searchToken}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
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
      throw new Error(error?.response?.data?.errorMessage);
    });

export const createPatientNote = (patientIdentifier, note) =>
  axios
    .post(`/patient/note/${patientIdentifier}`, note)
    .then(response => response.data)
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          'Error adding patient note. It may be too long. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });

export const updatePatientNote = note =>
  axios
    .put('/patient/note', note)
    .then(response => response.data)
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error updating patient note. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });

export const deletePatientNote = patientNoteIdentifier =>
  axios
    .delete(`/patient/note/deletePatientNoteById/${patientNoteIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error deleting patient note. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });

export const archivePatient = patientNoteIdentifier =>
  axios
    .delete(`/patient/archivePatient/${patientNoteIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error archiving patient. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });

export function downloadPatientImportTemplate() {
  return axios({
    url: `/patient/downloadPatientImportTemplate`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', 'Patient_Data_Upload_Template.xlsx');
      document.body.append(link);
      link.click();
    })
    .catch(noop);
}

export function uploadPatientData(fileData, additionalConfig = {}) {
  const formData = new FormData();
  formData.append('file', fileData);

  return axios
    .post(`patient/uploadData`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      if (error.response && error.response.status === 413) {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'File exceeded the allowed size of 100 MB',
        });
      } else {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'Error in uploading patient data. Please try again.',
        });
      }
      throw error;
    });
}

export function getLatestPatientImportDetails() {
  return axios
    .get('patient/getLatestPatientImportProcessStatus')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
