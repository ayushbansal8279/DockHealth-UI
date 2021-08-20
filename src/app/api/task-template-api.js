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

export function getTemplateLayout(taskTemplateIdentifier) {
  return axios
    .get(`task/template/layout/${taskTemplateIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function saveTemplateLayout(taskTemplateIdentifier, layout) {
  return axios
    .post(`task/template/layout/${taskTemplateIdentifier}`, layout)
    .then(response => response.data);
}

export function addTaskOutcome(taskIdentifier, name) {
  return axios
    .post(`task/outcome/${taskIdentifier}`, {
      name,
    })
    .then(({ data }) => data);
}

export function updateTaskOutcome(taskOutcomeIdentifier, dataToUpdate) {
  return axios
    .patch(`task/outcome`, { ...dataToUpdate, taskOutcomeIdentifier })
    .then(({ data }) => data);
}
