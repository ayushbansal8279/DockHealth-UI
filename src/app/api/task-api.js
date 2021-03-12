/* eslint-disable eqeqeq */
/* eslint-disable sonarjs/no-identical-functions */
import { noop, showAlert } from 'helpers/utility-functions';
import axios from './axios-heydoc';
import URLS from '../urls';

export function getTaskStatsForUser(userIdentifier) {
  return axios
    .get(`/task/stats/getTaskStatsForUser/${userIdentifier}`)
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getListTasksGroupedByTaskGroup(
  taskListIdentifier,
  status = 'INCOMPLETE',
  sortBy,
  startPosition = 0,
  endPosition = 0,
  viewMode,
) {
  return axios
    .get(`task/findListTasksGroupedByTaskGroup/${taskListIdentifier}`, {
      params: {
        status,
        startPosition,
        endPosition,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
        viewMode: viewMode || undefined,
      },
    })
    .then(response => response?.data)
    .catch(error => {
      throw error;
    });
}

export function getTasksAssignedToSpecificUser(userIdentifier, sortBy, status) {
  return axios
    .get(`task/findTasksAssignedToSpecificUser?userId=${userIdentifier}`, {
      params: {
        status,
        sortBy: sortBy?.key || undefined,
        sortDirection: sortBy?.order || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

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
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
  return axios
    .get(
      `task/searchTasks?searchTerm=${searchTerm}&status=${status}&taskListIdentifier=${taskListIdentifier}&startPosition=${startPosition}&endPosition=${endPosition}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function addTask(task) {
  return axios
    .post('task', {
      ...task,
      createdByUserIdentifier: sessionStorage.userIdentifier,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in creating task. Please try again.',
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
    .then(response => {
      return response;
    });
}

export function partialUpdateTask(taskIdentifier, dataToUpdate) {
  return axios
    .patch(`task/${taskIdentifier}`, dataToUpdate)
    .then(({ data }) => {
      return data;
    });
}

export function deleteTask(taskIdentifier) {
  return axios
    .delete(`task/deleteTaskById/${taskIdentifier}`)
    .then(response => {
      console.log('response', response);
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function duplicateTask(taskIdentifier, includeAttachments) {
  return axios
    .put(
      `task/duplicateTask/${taskIdentifier}?includeAttachments=${includeAttachments}`,
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in duplicating task. Please try again.',
      });
      throw error;
    });
}

export function sortSubTask(taskIdentifier, direction) {
  return axios
    .put(`task/sortSubTask/${taskIdentifier}/${direction}`)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in changing sub task order. Please try again.',
      });
      throw error;
    });
}

export function markComplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskIdentifier}?status=COMPLETE`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function markIncomplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskIdentifier}?status=INCOMPLETE`)
    .then(response => {
      return response;
    })
    .catch(error => {
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
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export const updateDueDate = (taskIdentifier, dueDate) => {
  return axios
    .put(
      `task/addOrUpdateDueDate/${taskIdentifier}`,
      {},
      {
        params: {
          dueDate: dueDate ? dueDate.format('MM/DD/YYYY HH:mm:ss ZZ') : null,
        },
      },
    )
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};

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
    .catch(error => error?.response?.data);

export function markHighPriority(taskIdentifier) {
  return axios
    .put(`task/changePriority/${taskIdentifier}?priorityLevel=HIGH`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function markLowPriority(taskIdentifier) {
  return axios
    .put(`task/changePriority/${taskIdentifier}?priorityLevel=LOW`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
}

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
    .then(response => {
      return response.data;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in task assignment. Please try again.',
      });
      throw error;
    });
}

export function addComment(taskIdentifier, taskComment) {
  return axios
    .post(`task/comment/${taskIdentifier}`, taskComment)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function deleteComment(commentIdentifier) {
  return axios
    .delete(`task/comment/deleteCommentById/${commentIdentifier}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in deleting comment. Please try again.',
      });
      throw error;
    });
}

export function updateComment(comment) {
  return axios
    .put('task/comment', comment)
    .then(response => {
      return response;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in updating comment. Please try again.',
      });
      throw error;
    });
}

export function flagUnread(taskIdentifier, unread) {
  return axios
    .put(`task/flagUserTaskAsUnread/${taskIdentifier}?flagUnread=${unread}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getTaskHistory(taskIdentifier) {
  return axios
    .get(`audit/findAuditsByTask/${taskIdentifier}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function addTaskAttachment(
  taskIdentifier,
  fileData,
  additionalConfig = {},
) {
  const formData = new FormData();
  formData.append('file', fileData);

  return axios
    .post(`task/attachment/${taskIdentifier}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...additionalConfig,
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      if (error.response && error.response.status === 413) {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'File exceeded the allowed size of 100 MB',
        });
      } else {
        showAlert({
          status: 'error',
          title: 'Error',
          text: 'Error in saving attachment. Please try again.',
        });
      }
      throw error;
    });
}

export function removeTaskAttachment(taskAttachmentId) {
  return axios
    .delete(`task/attachment/${taskAttachmentId}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      showAlert({
        status: 'error',
        title: 'Error',
        text: 'Error in removing attachment. Please try again.',
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
    .then(response => {
      return response;
    })
    .catch(noop);
}

export function getTaskDetails(taskIdentifier) {
  return axios
    .get(`task/${taskIdentifier}`)
    .then(({ data }) => data)
    .catch(error => {
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
    .catch(error => {
      throw error;
    });
}

export function reorderSubtasksForTask(
  orderedTaskIds,
  taskGroupIdentifier,
  parentTaskIdentifier,
) {
  return axios
    .put('task/sortSubTasksForTask', {
      taskIdentifiers: orderedTaskIds,
      taskGroupIdentifier,
      parentTaskIdentifier,
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export const reassignTasksToAnotherGroup = (
  taskGroupIdentifier,
  taskIdentifiers,
) =>
  axios
    .put(URLS.tasks.reassignTasks(taskGroupIdentifier), {
      taskIdentifiers,
    })
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });

export function getFilteredTasksForList(
  taskListIdentifier,
  status = 'INCOMPLETE',
  sortBy,
  selectedFilters,
) {
  return axios
    .post(
      `task/filter/filterSpecificTasksByCriteria/${taskListIdentifier}`,
      selectedFilters,
      {
        params: {
          status,
          sortBy: sortBy?.key || undefined,
          sortDirection: sortBy?.order || undefined,
        },
      },
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getFilteredTasksForPersonList(
  userIdentifier,
  sortBy,
  selectedFilters,
  status = 'INCOMPLETE',
) {
  return axios
    .post(
      `/task/filter/filterTasksByCriteriaForAssignedToUser/${userIdentifier}`,
      selectedFilters,
      {
        params: {
          status,
          sortBy: sortBy?.key || undefined,
          sortDirection: sortBy?.order || undefined,
        },
      },
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function getTasksForTaskListByTaskGroup(
  taskListIdentifier,
  taskGroupIdentifier,
  status,
  startPosition = 0,
  endPosition = 0,
  sort,
  viewMode,
) {
  return axios
    .get(
      `/task/findListTasksByTaskGroup/${taskListIdentifier}/${taskGroupIdentifier}`,
      {
        params: {
          status,
          startPosition,
          endPosition,
          sortBy: sort?.key || undefined,
          sortDirection: sort?.order || undefined,
          viewMode: viewMode || undefined,
        },
      },
    )
    .then(({ data }) => data)
    .catch(error => {
      throw error;
    });
}

export function searchTasksByTaskList(taskListIdentifier, searchTerm, status) {
  return axios
    .get(
      `/task/searchTasksByTaskList/${taskListIdentifier}?searchTerm=${searchTerm}&status=${status}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export const bulkEditTasks = bulkEditOption =>
  axios.put('/task/bulkEdit', bulkEditOption).then(({ data }) => data);

export function rollbackTransaction(transactionIdentifier) {
  return axios
    .put(`/task/rollbackTransaction/${transactionIdentifier}`)
    .then(({ data }) => data);
}
