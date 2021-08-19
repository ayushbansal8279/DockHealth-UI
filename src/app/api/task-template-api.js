import axios from './axios-heydoc';

export function getTemplates() {
  return axios
    .get(`task/template/getRootTemplatesForOrganization`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
export function getTemplatesForSpecificFolder(taskTemplateIdentifier) {
  return axios
    .get(`task/template/findChildTemplates/${taskTemplateIdentifier}`)
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

export function addTemplate(newTemplate, parentTaskTemplateIdentifier) {
  return axios
    .post(`task/template`, { ...newTemplate, parentTaskTemplateIdentifier })
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

export function duplicateTemplate(
  templateIdentifier,
  includeAttachments = false,
) {
  return axios
    .put(
      `task/template/duplicate/${templateIdentifier}`,
      {},
      {
        params: {
          includeAttachments,
        },
      },
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function reorderTasksForTemplate(
  taskTemplateIdentifier,
  orderedTaskIdentifiers,
) {
  return axios
    .put(`task/template/sortTasksInTemplate`, {
      taskTemplateIdentifier,
      taskIdentifiers: orderedTaskIdentifiers,
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
