import axios from './axios-heydoc';

export function moveTemplateToFolder(identifier, parentTaskWorkflowIdentifier) {
  return axios
    .patch(`task/template/move`, {
      parentTaskWorkflowIdentifier,
      identifier,
    })
    .then((response) => response.data);
}

export function copyWorkflowToOrganization(
  identifier,
  targetOrganizationIdentifiers,
) {
  return axios
    .patch(`task/template/copyToOrg`, {
      targetOrganizationIdentifiers: [...targetOrganizationIdentifiers],
      identifier,
    })
    .then((response) => {
      return response.data;
    });
}

export function getAllTemplatesForOrganization() {
  return axios
    .get(`task/template/getTemplatesForOrganization`)
    .then((response) => response.data);
}

export function getTemplates(includeAll) {
  return axios
    .get(
      `task/template/getRootTemplatesForOrganization?includeAll=${includeAll}`,
    )
    .then((response) => response.data);
}

export function searchTemplates(searchPhrase) {
  return axios
    .get(`task/template/searchTemplatesByName?searchTerm=${searchPhrase}`)
    .then((response) => response.data);
}

export function getTemplatesForSpecificFolder(taskTemplateIdentifier) {
  return axios
    .get(`task/template/findChildTemplates/${taskTemplateIdentifier}`)
    .then((response) => response.data);
}

export function getTasksForTemplate(taskTemplateIdentifier) {
  return axios
    .get(`task/template/findTasks/${taskTemplateIdentifier}`)
    .then((response) => response.data);
}

export function getTemplate(identifier) {
  return axios.get(`task/workflow/${identifier}`).then(({ data }) => data);
}

export function getTemplateBasicDetails(identifier) {
  return axios
    .get(`task/workflow/${identifier}?basicDetails=true`)
    .then(({ data }) => data);
}

export function addTemplate(newTemplate, parentTaskWorkflowIdentifier) {
  return axios
    .post(`task/workflow`, { ...newTemplate, parentTaskWorkflowIdentifier })
    .then((response) => response.data);
}

export function updatePartialWorkflow(taskWorkflowIdentifier, dataToUpdate) {
  // const arrayUniqueByKey = [
  //   ...new Map(
  //     dataToUpdate?.taskMetaData.map(item => [
  //       item.customFieldIdentifier,
  //       item,
  //     ]),
  //   ).values(),
  // ];
  return axios
    .patch(`task/workflow/${taskWorkflowIdentifier}`, dataToUpdate)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function switchTemplatePublic(taskTemplateIdentifier, flagPublic) {
  return axios
    .patch(
      `task/template/${taskTemplateIdentifier}/public?flagPublic=${flagPublic}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function removeUserFromWorkflow(taskTemplateIdentifier, userIdentifier) {
  return axios
    .delete(
      `task/template/${taskTemplateIdentifier}/member?userIdentifier=${userIdentifier}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function updateUserInWorkflowPermissions(
  taskTemplateIdentifier,
  userIdentifier,
  memberPermission,
) {
  return axios
    .patch(
      `task/template/${taskTemplateIdentifier}/member?userIdentifier=${userIdentifier}&memberPermission=${memberPermission}`,
    )
    .then((response) => response.data)
    .catch((error) => {
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
    .then((response) => response.data);
}

export function getTemplateLayout(taskTemplateIdentifier) {
  return axios
    .get(`task/template/layout/${taskTemplateIdentifier}`)
    .then((response) => response.data);
}

export function saveTemplateLayout(taskTemplateIdentifier, layout) {
  return axios
    .post(`task/template/layout/${taskTemplateIdentifier}`, layout)
    .then((response) => response.data);
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

export function addUsersToPermissionList(
  taskTemplateIdentifier,
  invitedUsersIdentifier,
) {
  return axios
    .post(`task/template/${taskTemplateIdentifier}/member`, {
      invitedUsersIdentifier,
    })
    .then(({ data }) => data);
}
