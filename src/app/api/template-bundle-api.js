import axios from './axios-heydoc';

export function getTemplateBundle(identifier) {
  return axios
    .get(`task/workflow/${identifier}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function updateTemplateBundle(identifier, templateBundle) {
  return axios
    .patch(`task/workflow/${identifier}`, {
      ...templateBundle,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function moveWorkflowToList(
  identifier,
  taskListIdentifier,
  taskGroupIdentifier,
) {
  return axios
    .patch(`task/workflow/${identifier}`, {
      taskListIdentifier,
      parentTaskWorkflowIdentifier: taskGroupIdentifier,
    })
    .then(({ data }) => data);
}

export function moveWorkflowToGroup(identifier, taskGroupIdentifier) {
  return axios
    .patch(`task/workflow/${identifier}`, {
      parentTaskWorkflowIdentifier: taskGroupIdentifier,
    })
    .then(({ data }) => data);
}

export function useTemplate({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
  patientIdentifier,
  profileIdentifier,
  unassign = false,
}) {
  return axios
    .post(`task/workflow/useTemplate`, {
      taskTemplateIdentifier,
      taskGroupIdentifier,
      taskListIdentifier,
      patientIdentifier,
      profileIdentifier,
      overrideAssignmentMismatch: unassign,
    })
    .then((response) => response.data)
    .catch((error) => {
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
    .catch((error) => {
      throw error;
    });
}
