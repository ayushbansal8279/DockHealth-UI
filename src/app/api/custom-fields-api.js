import axios from './axios-heydoc';
import { log } from '../helpers/log';

export function getAllPatientCustomFields(active = true, patientIdentifier) {
  return axios
    .get(`custom/field/getAll/PATIENT`, {
      params: { active, targetIdentifier: patientIdentifier },
    })
    .then(({ data }) => data);
}

export function getAllTaskListCustomFields(taskListIdentifier) {
  return axios
    .get(`custom/field/getAll/TASK`, {
      params: { taskListIdentifier },
    })
    .then(({ data }) => data);
}

export function getAllProviderCustomFields() {
  return axios.get(`custom/field/getAll/PROVIDER`).then(({ data }) => data);
}

export function getAllTaskCustomFields(targetIdentifier, taskListIdentifier) {
  return axios
    .get(`custom/field/getAll/TASK`, {
      params: { targetIdentifier, taskListIdentifier },
    })
    .then(({ data }) => data);
}

export function addCustomField(customField, targetType, taskListIdentifier) {
  return axios
    .post(`custom/field`, {
      ...customField,
      contextType: 'CUSTOM',
      targetType,
      taskListIdentifier,
    })
    .then(({ data }) => data);
}

export function updateCustomField(customField, targetType, taskListIdentifier) {
  return axios.put(`custom/field`, {
    ...customField,
    contextType: 'CUSTOM',
    targetType,
    taskListIdentifier,
  });
}

export function deleteCustomField(identifier) {
  return axios.delete(`custom/field/${identifier}`).then(({ data }) => data);
}

export function sortPatientCustomFields(identifiers) {
  return axios.put(`custom/field/sortCustomFields/PATIENT`, {
    customFieldIdentifiers: identifiers,
  });
}

export function sortTaskCustomFields(identifiers, taskListIdentifier) {
  const taskListParameter = `?taskListIdentifier=${taskListIdentifier}`;
  return axios.put(
    `custom/field/sortCustomFields/TASK${
      taskListIdentifier ? taskListParameter : ''
    }`,
    {
      customFieldIdentifiers: identifiers,
    },
  );
}
export function sortUserCustomFields(identifiers) {
  return axios.put(`custom/field/sortCustomFields/PROVIDER`, {
    customFieldIdentifiers: identifiers,
  });
}

export function saveCustomFiledGroup(customFiledGroup) {
  return axios
    .post('/customFieldGroup', customFiledGroup)
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updateCustomFiledGroup(customFiledGroupIdentifier, payload) {
  return axios
    .patch(`/customFieldGroup/${customFiledGroupIdentifier}`, payload)
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteCustomFiledGroup(customFiledGroupIdentifier) {
  return axios
    .delete(`/customFieldGroup/${customFiledGroupIdentifier}`)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function searchCustomFiledGroups(context, profileTypeIdentifier) {
  if (context === 'PATIENT') {
    return axios
      .get(`/customFieldGroup/search?context=${context}`)
      .then(({ data }) => data)
      .catch((error) => {
        log(error);
        throw new Error(error?.response?.data?.errorMessage);
      });
  }
  if (context === 'PROFILETYPE') {
    return axios
      .get(
        `/customFieldGroup/search?context=${context}&profileTypeIdentifier=${profileTypeIdentifier
          
        }`,
      )
      .then(({ data }) => data)
      .catch((error) => {
        log(error);
        throw new Error(error?.response?.data?.errorMessage);
      });
  }
}

export function getDefauldFields(context) {
  return axios
    .get(
      `/fieldReference/findDefaultsByContext?isDefault=true&context=${context}`,
    )
    .then(({ data }) => data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
