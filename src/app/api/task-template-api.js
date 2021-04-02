import axios from './axios-heydoc';

export function getTemplates() {
  return axios
    .get(`task/template/getTemplatesForOrganization`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function getTasksForTemplate(taskTemplateIdentifier) {
  return axios
    .get(`task/template/findTasks/${taskTemplateIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function addTemplate(newTemplate) {
  return axios
    .post(`task/template`, newTemplate)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function updateTemplate(newTemplate) {
  return axios
    .put(`task/template`, newTemplate)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function deleteTemplate(templateIdentifier) {
  return axios
    .delete(`task/template/${templateIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function duplicateTemplate(templateIdentifier) {
  // TODO: check api url when created
  return axios
    .put(`task/template/duplicateTemplate/${templateIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
