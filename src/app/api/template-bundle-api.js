import axios from './axios-heydoc';

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

export function getTemplateBundle(taskBundleIdentifier) {
  return axios
    .get(`task/taskBundle/${taskBundleIdentifier}`)
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

export function updateTemplateBundle(templateIdentifier, templateBundle) {
  return axios
    .put(`task/updateTaskBundle/${templateIdentifier}`, {
      ...templateBundle,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function moveTemplateBundle(
  templateIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
) {
  return axios
    .put(`task/updateTaskBundle/${templateIdentifier}`, {
      taskListIdentifier,
      parentTaskGroupIdentifier: taskGroupIdentifier,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function applyTemplate({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
  patientIdentifier,
  unassign = false,
}) {
  return axios
    .post(`task/useTemplate`, {
      taskTemplateIdentifier,
      taskGroupIdentifier,
      taskListIdentifier,
      patientIdentifier,
      overrideAssignmentMismatch: unassign,
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function reorderTasksInBundle(bundleIdentifier, orderedTaskIds) {
  return axios
    .put('task/sortTasksInTaskGroup', {
      taskIdentifiers: orderedTaskIds,
      taskGroupIdentifier: bundleIdentifier,
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}
