import axios from 'api/axios-heydoc';
import { PatientAttachmentType } from 'helpers/patient-details-helpers';

export function createPatientAttachment(
  patientIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig = {},
) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));
  formData.append('parentAttachmentIdentifier', folderIdentifier ?? undefined);

  return axios
    .post(`patient/attachment/${patientIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then(({ data }) => data);
}

export function deletePatientAttachment(identifier) {
  return axios
    .delete(`patient/attachment/${identifier}`)
    .then((response) => response);
}

export function downloadPatientAttachment(attachmentIdentifier) {
  return axios({
    url: `patient/attachment/download/${attachmentIdentifier}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then((response) => response);
}

export function getPatientAttachments(patientIdentifier, folderIdentifier) {
  return axios
    .get(
      `patient/attachment/getPatientAttachmentsInFolder/${patientIdentifier}`,
      {
        params: { parentAttachmentIdentifier: folderIdentifier ?? undefined },
      },
    )
    .then(({ data }) => data);
}

export function getTaskAndWorkflowAttachmentsForPatient(patientIdentifier){
  return axios
    .get(
      `task/attachment/getTaskAndWorkflowAttachmentsForPatient/${patientIdentifier}`,
    )
    .then(({data})=>data)
}

export function createAttachmentFolder(
  patientIdentifier,
  name,
  folderIdentifier,
) {
  return axios
    .post(`patient/attachment/other`, {
      patientIdentifier,
      fileName: name,
      type: PatientAttachmentType.FOLDER,
      parentAttachmentIdentifier: folderIdentifier ?? undefined,
    })
    .then(({ data }) => data);
}

export function createAttachmentReference(
  patientIdentifier,
  name,
  url,
  mimeType,
  referenceType,
  folderIdentifier,
) {
  return axios
    .post(`patient/attachment/other`, {
      patientIdentifier,
      fileName: name,
      // TODO: check property name for file url when backend will be done
      fileUrl: url,
      contentType: mimeType,
      type: referenceType,
      parentAttachmentIdentifier: folderIdentifier ?? undefined,
    })
    .then(({ data }) => data);
}

export function updatePatientAttachment(attachment) {
  return axios.put(`patient/attachment`, attachment).then(({ data }) => data);
}

export function getPatientFolderStructureHierarchy(identifier) {
  return axios
    .get(`patient/attachment/${identifier}`, {
      params: { parentDetails: true },
    })
    .then(({ data }) => data);
}

export function getPatientFolder(identifier) {
  return axios.get(`patient/attachment/${identifier}`).then(({ data }) => data);
}
