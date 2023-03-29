import axios from './axios-heydoc';

export function getAllTemplates() {
  return axios.get(`template/getAll`).then(({ data }) => data);
}

export function getAllTemplateNames(type) {
  return axios
    .get(`template/getNamesByType?templateType=${type}`)
    .then(({ data }) => data);
}

export function getTemplateDetails(templateIdentifier, taskIdentifier) {
  return axios
    .get(`template/${templateIdentifier}?taskIdentifier=${taskIdentifier}`)
    .then(({ data }) => data);
}

export function createTemplate(template) {
  return axios.post(`template`, template).then(({ data }) => data);
}

export function editTemplate(template) {
  return axios.put(`template`, template).then(({ data }) => data);
}

export function deleteTemplate(identifier) {
  return axios.delete(`template/${identifier}`).then(({ data }) => data);
}
