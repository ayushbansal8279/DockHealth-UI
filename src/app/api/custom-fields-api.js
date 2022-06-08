import axios from './axios-heydoc';

export function getAllPatientCustomFields(
  active = true,
  patientIdentifier = undefined,
) {
  return axios
    .get(`custom/field/getAll/PATIENT`, {
      params: { active, targetIdentifier: patientIdentifier },
    })
    .then(({ data }) => data);
}

export function getAllTaskListCustomFields(taskListIdentifier = undefined) {
  return axios
    .get(`custom/field/getAll/TASK`, {
      params: { taskListIdentifier },
    })
    .then(({ data }) => data);
}

export function getAllProviderCustomFields() {
  return axios.get(`custom/field/getAll/PROVIDER`).then(({ data }) => data);
}

export function getAllTaskCustomFields(
  targetIdentifier = undefined,
  taskListIdentifier = undefined,
) {
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
