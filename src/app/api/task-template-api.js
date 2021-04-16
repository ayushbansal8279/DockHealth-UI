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

export function useTemplate(
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
) {
  return axios.post(`task/useTemplate`, {
    taskTemplateIdentifier,
    taskGroupIdentifier,
    taskListIdentifier,
  });
}

export function deleteTemplateBundle(templateIdentifier) {
  return axios
    .delete(`task/deleteTaskBundle/${templateIdentifier}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function duplicateTemplateBundle(
  templateIdentifier,
  includeAttachments = false,
) {
  return axios
    .put(
      `task/duplicateTaskBundle/${templateIdentifier}`,
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

export function moveTemplateBundle(templateIdentifier, selectedDestination) {
  return axios
    .put(`task/updateTaskBundle/${templateIdentifier}`, {
      ...selectedDestination,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
