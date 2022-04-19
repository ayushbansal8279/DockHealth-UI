import {
  mapFilterOptions,
  mapSelectedOptionsToRequestPayload,
} from 'helpers/filter-options-helpers';
import axios from './axios-heydoc';

export const getPatientsLists = () =>
  axios.get('patient/list/getAll').then(response => response.data);

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
      .get(`patient/list/${identifier}`)
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
    .then(response => response.data);
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
  const request = !selectedFilters
    ? axios
        .get(`patient/filter/filterOptionsForList/${patientsListIdentifier}`)
        .then(({ data }) => data)
    : axios
        .post(
          `patient/filter/filterPatientsByCriteria/${patientsListIdentifier}`,
          mapSelectedOptionsToRequestPayload(selectedFilters),
        )
        .then(({ data: { patientFilterOptions } }) => patientFilterOptions);

  return request.then(options => mapFilterOptions(options));
}

const PatientBulkActions = {
  CREATE_TASK: 'CREATE_TASK',
  CREATE_WORKFLOW: 'CREATE_WORKFLOW',
  ADD_LABEL: 'ADD_LABEL',
  DELETE_PATIENT: 'DELETE_PATIENT',
};

export const patientBulkCreateTask = payload => {
  const { assignedToUsers, taskListIdentifier, description } = payload;

  const body = {
    bulkOperationType: PatientBulkActions.CREATE_TASK,
    taskDescription: description,
    taskListIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkCreateWorkflow = payload => {
  const { assignedToUsers, taskListIdentifier, workflowIdentifier } = payload;

  const body = {
    bulkOperationType: PatientBulkActions.CREATE_WORKFLOW,
    workflowIdentifier,
    taskListIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkDeletePatient = patientIdentifiers => {
  const body = {
    bulkOperationType: PatientBulkActions.DELETE_PATIENT,
    patientIdentifiers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};

export const patientBulkAddLabel = payload => {
  const { labelIdentifier, labelName, assignedToUsers } = payload;
  const body = {
    bulkOperationType: PatientBulkActions.ADD_LABEL,
    labelIdentifier: labelIdentifier || null,
    labelName: labelName || null,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).then(({ data }) => data);
};
