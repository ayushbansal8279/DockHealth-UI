import axios from 'api/axios-heydoc';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';

export function addPatientAttachment(
  patientIdentifier,
  fileData,
  additionalConfig = {},
) {
  const formData = new FormData();
  formData.append('file', fileData);

  return axios
    .post(`patient/attachment/${patientIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then(response => {
      return response;
    });
}

export function removePatientAttachment(attachmentIdentifier) {
  return axios
    .delete(`patient/attachment/${attachmentIdentifier}`)
    .then(response => {
      return response;
    });
}

export function getPatientAttachment(attachmentIdentifier) {
  return axios({
    url: `patient/attachment/download/${attachmentIdentifier}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then(response => {
    return response;
  });
}

export function getPatientAttachments(patientIdentifier) {
  return axios
    .get(`/patient/attachment/getPatientAttachments/${patientIdentifier}`)
    .then(({ data }) => data);
}

export function createAttachmentFolder(patientIdentifier, name) {
  return axios
    .post(`patient/attachment/other`, {
      patientIdentifier,
      fileName: name,
      type: PatientAttachmentType.FOLDER,
    })
    .then(({ data }) => data);
}
