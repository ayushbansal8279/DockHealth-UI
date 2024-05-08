import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export function getGenderIdentityOptions() {
  return axios
    .get(`reference/genderIdentities`)
    .then((response) => response.data);
}

export const getPatientsLists = () =>
  axios.get('patient/list/getAll').then((response) => response.data);

export function getPatientsByListId(patientsListIdentifier) {
  return axios
    .get(`patient/list/${patientsListIdentifier}`)
    .then(({ data: { patients } }) => patients);
}

export function getPatientsByFilterCriteria(
  patientsListIdentifier,
  filterOptions,
) {
  return axios
    .post(
      `patient/filter/filterPatientsByCriteria/${patientsListIdentifier}`,
      mapSelectedOptionsToRequestPayload(filterOptions),
    )
    .then(({ data: { patients } }) => patients);
}

export function getPatientsListDetails(identifier) {
  return (
    axios
      .get(`patient/list/${identifier}?basicDetails=true`)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then(({ data: { patients, ...restData } }) => restData)
  );
}

export function getPatientsByCriteria(searchCriteria, patientListIdentifier) {
  return axios
    .get(`patient/getPatientsByCriteria`, {
      params: {
        searchCriteria,
        patientListIdentifier,
      },
    })
    .then((response) => response.data);
}

export function createPatientsList(patientList) {
  return axios.post(`patient/list`, patientList).then(({ data }) => data);
}

export function updatePatientsList(identifier, patientListData) {
  return axios
    .patch(`patient/list`, {
      patientListIdentifier: identifier,
      ...patientListData,
    })
    .then(({ data }) => data);
}

export function deletePatientsList(identifier) {
  return axios.delete(`patient/list/${identifier}`);
}

export function getPatientsListFilterOptions(
  patientsListIdentifier,
  selectedFilters,
) {
  const request = selectedFilters
    ? axios
        .post(
          `patient/filter/filterPatientsByCriteria/${patientsListIdentifier}`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
        )
        .then(({ data: { patientFilterOptions } }) => patientFilterOptions)
    : axios
        .get(`patient/filter/filterOptionsForList/${patientsListIdentifier}`)
        .then(({ data }) => data);

  return request.then((options) => mapFilterOptions(options));
}

export const PatientBulkActions = {
  CREATE_TASK: 'CREATE_TASK',
  CREATE_WORKFLOW: 'CREATE_WORKFLOW',
  ADD_LABEL: 'ADD_LABEL',
  DELETE_PATIENT: 'DELETE_PATIENT',
  ARCHIVE_PATIENT: 'ARCHIVE_PATIENT',
  RESTORE_PATIENT: 'RESTORE_PATIENT',
  UNARCHIVE_PATIENT: 'UNARCHIVE_PATIENT',
  DELETE_LABEL: 'DELETE_LABEL',
  EDIT_META_DATA: 'EDIT_META_DATA',
};

export const patientBulkCreateTask = (payload) => {
  const {
    assignedToUsers,
    taskListIdentifier,
    taskGroupIdentifier,
    description,
  } = payload;
  const body = {
    bulkOperationType: PatientBulkActions.CREATE_TASK,
    taskDescription: description,
    taskListIdentifier,
    taskGroupIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkCreateWorkflow = (payload) => {
  const { assignedToUsers, taskListIdentifier, workflowIdentifier } = payload;

  const body = {
    bulkOperationType: PatientBulkActions.CREATE_WORKFLOW,
    workflowIdentifier,
    taskListIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkDeletePatient = (patientIdentifiers) => {
  const body = {
    bulkOperationType: PatientBulkActions.DELETE_PATIENT,
    patientIdentifiers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkUpdatePatient = (
  patientIdentifiers,
  bulkOperationType,
) => {
  const body = {
    bulkOperationType,
    patientIdentifiers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};
export const patientBulkAddLabel = (payload) => {
  const { labelIdentifier, labelName, assignedToUsers } = payload;
  const body = {
    bulkOperationType: PatientBulkActions.ADD_LABEL,
    labelIdentifier: labelIdentifier || null,
    labelName: labelName || null,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkDeleteLabel = (payload) => {
  const { labelIdentifier, labelName, assignedToUsers } = payload;
  const body = {
    bulkOperationType: PatientBulkActions.DELETE_LABEL,
    labelIdentifier: labelIdentifier || null,
    labelName: labelName || null,
    patientIdentifiers: assignedToUsers,
  };
  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export function updatePatientListPreferences(setup, patientListIdentifier) {
  return axios
    .put(`patient/list/updateUserPreferences/${patientListIdentifier}`, setup)
    .then(({ data }) => data);
}

/**
 * Update patient by identifier
 * @param {string} id patientIdentifier
 * @param {object} payload payload to patch
 * @returns {Promise<any>} patient object info
 */
export function updatePatientById(id, payload) {
  return axios.patch(`patient/${id}`, payload).then(({ data }) => data);
}

/**
 *
 * @param {{ metaData: Array<object>; patientIdentifiers: Array<string>}} payload
 * @returns
 */
export const bulkEditPatientsCustomFields = ({
  metaData,
  patientIdentifiers,
}) =>
  axios
    .put('/patient/bulk', {
      bulkOperationType: PatientBulkActions.EDIT_META_DATA,
      metaData,
      patientIdentifiers,
    })
    .then(({ data }) => data);

