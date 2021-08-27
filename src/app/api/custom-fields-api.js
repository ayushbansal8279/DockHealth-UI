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

export function addPatientCustomField(customField) {
  return axios
    .post(`custom/field`, {
      ...customField,
      contextType: 'CUSTOM',
      targetType: 'PATIENT',
    })
    .then(({ data }) => data);
}

export function updatePatientCustomField(customField) {
  return axios.put(`custom/field`, {
    ...customField,
    contextType: 'CUSTOM',
    targetType: 'PATIENT',
  });
}

export function deletePatientCustomField(identifier) {
  return axios.delete(`custom/field/${identifier}`).then(({ data }) => data);
}

export function sendSortedPatientCustomFields(identifiers) {
  return axios.put(`custom/field/sortCustomFields/PATIENT`, {
    customFieldIdentifiers: identifiers,
  });
}
