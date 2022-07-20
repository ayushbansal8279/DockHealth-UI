import axios from './axios-heydoc';

export function getAllTemplates() {
  return axios.get(`template/getAll`).then(({ data }) => data);
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
