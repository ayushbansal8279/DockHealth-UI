/* eslint-disable import/prefer-default-export */
import axios from './axios-heydoc';

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
    .then(({ data }) => {
      return data;
    });
}

export function deleteWorkflow(identifier) {
  return axios.delete(`task/workflow/${identifier}`).then(({ data }) => data);
}

export function addWorkflowComment(workflowIdentifier, comment) {
  return axios
    .post(`task/comment/${workflowIdentifier}`, comment)
    .then(({ data }) => {
      return data;
    });
}

export function updateWorkflowComment(identifier, commentText) {
  return axios
    .put('task/comment', {
      commentIdentifier: identifier,
      comment: commentText,
    })
    .then(({ data }) => {
      return data;
    });
}

export function deleteWorkflowComment(identifier) {
  return axios
    .delete(`task/comment/deleteCommentById/${identifier}`)
    .then(({ data }) => {
      return data;
    });
}

export function getWorkflowAttachment(attachmentIdentifier) {
  return axios({
    url: `task/attachment/download/${attachmentIdentifier}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  }).then(({ data }) => {
    return data;
  });
}

export function addWorkflowAttachment(
  workflowIdentifier,
  fileData,
  onUploadProgress,
) {
  const formData = new FormData();
  formData.append('file', fileData);

  return axios
    .post(`task/attachment/${workflowIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then(({ data }) => {
      return data;
    });
}

export function deleteWorkflowAttachment(attachmentIdentifier) {
  return axios
    .delete(`task/attachment/${attachmentIdentifier}`)
    .then(({ data }) => {
      return data;
    });
}

export function getWorkflowHistory(workflowIdentifier) {
  return axios
    .get(`audit/findAuditsByTask/${workflowIdentifier}`)
    .then(({ data }) => data);
}
