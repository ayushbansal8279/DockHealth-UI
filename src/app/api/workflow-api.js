import axios from './axios-heydoc';

export function getWorkflow(identifier) {
  return axios.get(`task/workflow/${identifier}`).then(({ data }) => data);
}

export function duplicateWorkflow(identifier, includeAttachments = false) {
  return axios
    .put(
      `task/workflow/duplicate/${identifier}`,
      {},
      {
        params: {
          includeAttachments,
        },
      },
    )
    .then(({ data }) => data);
}

export function deleteWorkflow(identifier) {
  return axios.delete(`task/workflow/${identifier}`).then(({ data }) => data);
}

export function addWorkflowComment(workflowIdentifier, comment) {
  return axios
    .post(`task/comment/${workflowIdentifier}`, comment)
    .then(({ data }) => data);
}

export function updateWorkflowComment(identifier, commentText) {
  return axios
    .put('task/comment', {
      commentIdentifier: identifier,
      comment: commentText,
    })
    .then(({ data }) => data);
}

export function deleteWorkflowComment(identifier) {
  return axios
    .delete(`task/comment/deleteCommentById/${identifier}`)
    .then(({ data }) => data);
}

export function getWorkflowAttachment(attachmentIdentifier) {
  return axios({
    url: `task/attachment/download/${attachmentIdentifier}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then(({ data }) => data);
}

export function addWorkflowAttachment(
  workflowIdentifier,
  fileData,
  onUploadProgress,
) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));

  return axios
    .post(`task/attachment/${workflowIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then(({ data }) => data);
}

export function deleteWorkflowAttachment(attachmentIdentifier) {
  return axios
    .delete(`task/attachment/${attachmentIdentifier}`)
    .then(({ data }) => data);
}

export function getWorkflowHistory(workflowIdentifier) {
  return axios
    .get(`audit/findAuditsByWorkflow/${workflowIdentifier}`)
    .then(({ data }) => data);
}
