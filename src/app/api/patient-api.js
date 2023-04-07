import { fixList } from 'helpers/inbox-fix';
import { noop, showAlert } from 'helpers/utility-functions';
import { mapSelectedOptionsToRequestPayload } from 'helpers/filter-options-helpers';
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

export function getPatientById(patientIdentifier) {
  return axios
    .get(`patient/${patientIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function lookupEMRPatient(patientId) {
  return axios
    .get(`patient/lookupEMRPatient/${patientId}`)
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
          'Error adding. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updatePatient(patientIdentifier, details) {
  const patientDetails = details;
  if (patientDetails.dob === '') {
    // eslint-disable-next-line no-param-reassign
    patientDetails.dob = null;
  }
  delete patientDetails.patientId;
  delete patientDetails.age;
  delete patientDetails.notes;

  return axios
    .patch(`patient/${patientIdentifier}`, patientDetails)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error updating. Please try again.',
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
        text: 'Error adding note. It may be too long. Please try again.',
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
        text: 'Error updating note. Please try again.',
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
        text: 'Error deleting note. Please try again.',
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
        text: 'Error archiving. Please try again.',
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

export function downloadPatientListData(
  listIdentifier,
  selectedFilters,
  filename,
  includeAllAttributes,
) {
  return axios({
    url: `/patient/list/download/${listIdentifier}?includeAllAttributes=${includeAllAttributes}`,
    method: 'POST',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
    data: selectedFilters
      ? mapSelectedOptionsToRequestPayload(selectedFilters)
      : {},
  })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', filename);
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
          text: 'Error in uploading data. Please try again.',
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

export function changePatientNotePinnedFlag(patientNoteIdentifier, pinnedFlag) {
  return axios
    .patch(
      `/patient/note/pinned/${patientNoteIdentifier}`,
      {},
      { params: { pinnedFlag } },
    )
    .then(({ data }) => data);
}

export function getPatientWidgets() {
  return axios
    .get('widget/getAll/PATIENT')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function mergePatient(patientFromIdentifier, patientToIdentifier) {
  return axios
    .patch(`patient/mergePatient/${patientFromIdentifier}`, {
      mergeToPatientIdentifier: patientToIdentifier,
    })
    .then(({ data }) => data);
}

export function unarchivePatient(identifier) {
  return axios
    .patch(`patient/unarchivePatient/${identifier}`)
    .then(({ data }) => data);
}

export const getAllPatientAttachments = patientIdentifiers =>
  axios
    .post(`/patient/attachment/getAllPatientAttachments`, {
      patientIdentifiers,
    })
    .then(response => response.data)
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error getting patient attachments. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
