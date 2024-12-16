/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable sonarjs/no-identical-functions */
import moment from 'moment';
import { noop, showAlert } from 'helpers/utility-functions';
import { log } from 'helpers/log';
import axios from './axios-heydoc';
import { mapSelectedOptionsToRequestPayload } from '../helpers/filter-options-helpers';

export function searchTasks(
  searchTerm,
  status,
  taskListIdentifier = '',
  sortBy,
  filterBy,
  startPosition = 0,
  endPosition = 0,
) {
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/searchTasks?searchTerm=${searchTerm}&status=${status}&taskListIdentifier=${taskListIdentifier}&sortBy=${sortBy}&filterBy=${filterBy}&startPosition=${startPosition}&endPosition=${endPosition}`,
      )
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
  return axios
    .get(
      `task/searchTasks?searchTerm=${searchTerm}&status=${status}&taskListIdentifier=${taskListIdentifier}&startPosition=${startPosition}&endPosition=${endPosition}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function addTask(task) {
  return axios
    .post('task', {
      ...task,
    })
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in creating task. Please try again.',
      });
      throw error;
    });
}

export function updateTask(task) {
  return axios
    .put(`task/${task.taskIdentifier}`, {
      ...task,
      createdByUserIdentifier: sessionStorage.userIdentifier,
    })
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        text: error?.response?.data?.errorMessage ?? 'Error in updating task.',
      });
      throw error;
    });
}

export function findTasksByProfileGroupedByTaskList(profileIdentifier) {
  return axios
    .get(`/task/findTasksByProfileGroupedByTaskList/${profileIdentifier}`)
    .then(({ data }) => data);
}

export function partialUpdateTask(taskIdentifier, dataToUpdate) {
  return axios
    .patch(`task/${taskIdentifier}`, dataToUpdate)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.response?.data?.errorMessage ?? 'Error in updating task.',
      });
      throw error;
    });
}

export function updateTaskAssignment(taskIdentifier, dataToUpdate) {
  return axios
    .patch(`task/assign/${taskIdentifier}`, dataToUpdate)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in updating task assignment.',
      });
      throw error;
    });
}

export function updateTaskMetaData(taskIdentifier, dataToUpdate) {
  return axios
    .patch(`task/metadata/${taskIdentifier}`, dataToUpdate)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.response?.data?.errorMessage ?? 'Error in updating task.',
      });
      throw error;
    });
}

export function deleteTask(taskIdentifier) {
  return axios
    .delete(`task/deleteTaskById/${taskIdentifier}`)
    .then((response) => response)
    .catch((error) => {
      throw error;
    })
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.response?.data?.errorMessage ?? 'Error in deleting task.',
      });
      throw error;
    });
}

export function duplicateTask(taskIdentifier, includeAttachments) {
  return axios
    .put(
      `task/duplicateTask/${taskIdentifier}?includeAttachments=${includeAttachments}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ?? 'Error in duplicating task.',
      });
      throw error;
    });
}

export function sortSubTask(taskIdentifier, direction) {
  return axios
    .put(`task/sortSubTask/${taskIdentifier}/${direction}`)
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in changing sub task order. Please try again.',
      });
      throw error;
    });
}

export function markComplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskIdentifier}?status=COMPLETE`)
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ?? 'Error in completing task.',
      });
      throw error;
    });
}

export function markIncomplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskIdentifier}?status=INCOMPLETE`)
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ?? 'Error in uncompleting task.',
      });
      throw error;
    });
}

export function updateTaskDescription(task, description) {
  return axios
    .put(`task/${task.taskIdentifier}`, {
      // Fix overwriting other fields with null...
      ...task,
      patientIdentifier: task?.patient?.patientIdentifier,
      description,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export const updateStartDate = (taskIdentifier, startDate) =>
  axios
    .put(
      `task/addOrUpdateStartDate/${taskIdentifier}`,
      {},
      {
        params: {
          startDate: startDate
            ? moment(startDate).format('MM/DD/YYYY HH:mm:ss ZZ')
            : null,
        },
      },
    )
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ?? 'Error updating start date.',
      });
      throw error;
    });

export const updateDueDate = (taskIdentifier, dueDate, dueDateIntent) =>
  axios
    .put(
      `task/addOrUpdateDueDate/${taskIdentifier}`,
      {},
      {
        params: {
          dueDate: dueDate
            ? moment(dueDate).format('MM/DD/YYYY HH:mm:ss ZZ')
            : null,
          ...(dueDateIntent && {dueDateIntent}),
        },
      },
    )
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: error?.response?.data?.errorMessage ?? 'Error updating due date.',
      });
      throw error;
    });

/**
 * Updates task workflow status.
 * @param {number} taskIdentifier
 * @param {('BLOCKED'|'ON_HOLD'|'IN_PROGRESS')} workflowStatus
 * @returns {Promise}
 */
export const updateWorkflowStatus = (taskIdentifier, workflowStatus) =>
  axios
    .put(
      `task/updateTaskWorkflowStatus/${taskIdentifier}?workflowStatus=${workflowStatus}`,
    )
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error updating status. Please try again.',
      });
      throw error;
    });

export function assignOrReassignTask(task, assignedToUserIdentifier) {
  const { taskIdentifier } = task;
  let userIdentifierToAssignTask = assignedToUserIdentifier;
  if (!userIdentifierToAssignTask) {
    userIdentifierToAssignTask = '';
  }
  return axios
    .put(
      `task/addOrUpdateTaskAssignment/${taskIdentifier}?assignedToUserId=${userIdentifierToAssignTask}`,
    )
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in task assignment. Please try again.',
      });
      throw error;
    });
}

export function addComment(taskIdentifier, taskComment) {
  return axios
    .post(`task/comment/${taskIdentifier}`, taskComment)
    .then((response) => response);
}

export function deleteComment(commentIdentifier) {
  return axios
    .delete(`task/comment/deleteCommentById/${commentIdentifier}`)
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in deleting comment. Please try again.',
      });
      throw error;
    });
}

export function updateComment(comment) {
  return axios
    .put('task/comment', comment)
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in updating comment. Please try again.',
      });
      throw error;
    });
}

export function flagUnread(taskIdentifier, unread) {
  return axios
    .put(`task/flagUserTaskAsUnread/${taskIdentifier}?flagUnread=${unread}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
}

export function getTaskHistory(taskIdentifier) {
  return axios
    .get(`audit/findAuditsByTask/${taskIdentifier}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function addTaskAttachment(
  taskIdentifier,
  fileData,
  additionalConfig = {},
) {
  const formData = new FormData();
  formData.append('file', fileData, encodeURIComponent(fileData.name));

  return axios
    .post(`task/attachment/${taskIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then((response) => response)
    .catch((error) => {
      if (error.response && error.response.status === 413) {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.errorMessage ??
            'File exceeded the allowed size of 100 MB',
        });
      } else {
        showAlert({
          status: 'error',
          title: 'Error',
          text:
            error?.response?.data?.errorMessage ??
            'Error in saving attachment. Please try again.',
        });
      }
      throw error;
    });
}

export function removeTaskAttachment(taskAttachmentId) {
  return axios
    .delete(`task/attachment/${taskAttachmentId}`)
    .then((response) => response)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in removing attachment. Please try again.',
      });
      throw error;
    });
}

export function getTaskAttachment(taskAttachmentId) {
  return axios({
    url: `task/attachment/download/${taskAttachmentId}`,
    method: 'GET',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
  })
    .then((response) => response)
    .catch(noop);
}

export function updateTaskAttachment(attachmentIdentifier,fileName) {
  return axios.put(`task/attachment`, { attachmentIdentifier,fileName}).then(({ data }) => data);
}

export function getTaskDetails(taskIdentifier) {
  return axios
    .get(`task/${taskIdentifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
}

export function reorderTasksInGroup({ orderedTaskIds, taskGroupIdentifier }) {
  return axios
    .put('task/sortTasksInTaskGroup', {
      taskIdentifiers: orderedTaskIds,
      taskGroupIdentifier,
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });
}

export const reassignTasksToAnotherGroup = (
  taskGroupIdentifier,
  taskIdentifiers,
) =>
  axios
    .put(`task/group/assignTasksToTaskGroup/${taskGroupIdentifier}`, {
      taskIdentifiers,
    })
    .then(({ data }) => data)
    .catch((error) => {
      throw error;
    });

export const bulkEditTasks = (bulkEditOption) =>
  axios
    .put('/task/bulkEdit', bulkEditOption)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in bulk operation. Please try again.',
      });
      throw error;
    });

export function rollbackTransaction(transactionIdentifier) {
  return axios
    .put(`/task/rollbackTransaction/${transactionIdentifier}`)
    .then(({ data }) => data);
}

export function reorderSubtasks(
  parentTaskIdentifier,
  orderedSubtaskIdentifiers,
) {
  return axios
    .put(`task/sortSubTasksForTask`, {
      taskIdentifiers: orderedSubtaskIdentifiers,
      parentTaskIdentifier,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

export function getTaskRecurringSchedule(taskIdentifier) {
  return axios
    .get(`task/getTaskRecurringSchedule/${taskIdentifier}`)
    .then(({ data }) => data);
}

export function saveTaskRecurringSchedule(taskIdentifier, recurringData) {
  return axios
    .patch(`task/setTaskRecurringSchedule/${taskIdentifier}`, recurringData)
    .then(({ data }) => data);
}
export function chooseTaskOutcome(taskOutcomeIdentifier) {
  return axios
    .patch(`task/outcome/select/${taskOutcomeIdentifier} `, {
      isSelected: true,
    })
    .then(({ data }) => data);
}

export function getTaskDependencies(taskIdentifier) {
  return axios
    .get(`task/link/dependencies/${taskIdentifier}`, {
      params: {},
    })
    .then(({ data }) => data);
}

export function getAvailableTaskDependencies(taskIdentifier, searchTerm = '') {
  return axios
    .get(`task/lookupTasksForDependency/${taskIdentifier}`, {
      params: {
        searchTerm,
      },
    })
    .then(({ data }) => data);
}

export function addTaskDependencyLink(
  sourceTaskIdentifier,
  targetTaskIdentifier,
  payload,
) {
  return axios
    .post(`task/link`, {
      sourceTaskIdentifier,
      targetTaskIdentifier,
      ...payload,
    })
    .then(({ data }) => data);
}

export function createTasksLink(
  sourceTaskIdentifier,
  targetTaskIdentifier,
  options = {},
) {
  return axios
    .post(`task/link`, {
      sourceTaskIdentifier,
      targetTaskIdentifier,
      ...options,
    })
    .then(({ data }) => data);
}

export function deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier) {
  return axios
    .delete(`task/link`, {
      data: {
        sourceTaskIdentifier,
        targetTaskIdentifier,
      },
    })
    .then(({ data }) => data);
}

export function updateTasksLink(link) {
  return axios.put(`task/link`, link).then(({ data }) => data);
}

export function shareTask(
  taskIdentifier,
  userIdentifiers,
  externalUsers,
  message,
  assignTask,
) {
  // TODO: add sharing task endpoint
  return axios
    .post(`task/sharing`, {
      taskIdentifier,
      userIdentifiers,
      externalCollaborators: externalUsers,
      assignTask,
    })
    .then(({ data }) => data);
}

export function sendMessageForTask(task) {
  return axios.post('task/communication/send', task).then(({ data }) => data);
}

export function postToEMR(task) {
  return axios
    .post('task/communication/postToEMR', task)
    .then(({ data }) => data);
}

export function bulkEditCustomFieldsByTaskIdentifiers({
  metaData,
  taskIdentifiers,
  taskWorkflowIdentifiers,
}) {
  return axios.put('/task/bulkEdit', {
    bulkEditType: 'EDIT_META_DATA',
    metaData,
    taskIdentifiers,
    taskWorkflowIdentifiers,
  });
}

export function downloadTaskListData(
  listIdentifier,
  selectedTaskListStatus,
  filename,
) {
  return axios({
    url: `/list/download/${listIdentifier}?taskStatus=${selectedTaskListStatus}`,
    method: 'POST',
    responseType: 'blob',
    headers: {
      Accept: 'application/octet-stream',
    },
    data: {},
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.append(link);
      link.click();
    })
    .catch(noop);
}
