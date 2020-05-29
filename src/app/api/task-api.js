/* eslint-disable eqeqeq */
import { noop } from 'helpers/utility-functions';
import axios from './axios-heydoc';
import URLS from '../urls';

const ERROR_RETRIEVING_TASKS_MESSAGE =
  'Error in retrieving tasks. Please try again.';

/**
 * Get all tasks for a user
 */
export function getTasksForCreator() {
  return axios
    .get('task/findTasksCreatedByUser')
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getListTasksByUser(
  taskListIdentifier,
  status = 'COMPLETE',
  sortBy,
  filterBy,
  queryStartPosition = 0,
) {
  closeAddForm();

  return axios
    .get(`task/findListTasksByUser/${taskListIdentifier}`, {
      params: {
        status,
        queryStartPosition,
        sortBy: sortBy || undefined,
        filterBy: filterBy || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getListTasksCountByUser(
  taskListIdentifier,
  status = 'COMPLETE',
  filterBy,
) {
  return axios
    .get(`task/findCountOfListTasksByUser/${taskListIdentifier}`, {
      params: {
        status,
        filterBy: filterBy || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getTasksAssignedToMe(
  taskListIdentifier,
  status,
  sortBy,
  filterBy,
) {
  closeAddForm();
  if (taskListIdentifier != undefined) {
    if (sortBy != undefined || filterBy != undefined) {
      return axios
        .get(
          `task/findTasksAssignedToUser?taskListId=${taskListIdentifier}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
        )
        .then(response => response.data)
        .catch(error => {
          throw error;
        });
    }
    return axios
      .get(
        `task/findTasksAssignedToUser?taskListId=${taskListIdentifier}&status=${status}`,
      )
      .then(response => response.data)
      .catch(error => {
        throw error;
      })
      .catch(error => {
        throw error;
      });
  }
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findTasksAssignedToUser?status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
  return axios
    .get(`task/findTasksAssignedToUser?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getCountOfTasksAssignedToMe(
  taskListIdentifier,
  status = 'COMPLETE',
  filterBy,
) {
  return axios
    .get(`task/findCountOfTasksAssignedToUser`, {
      params: {
        status,
        filterBy: filterBy || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getTasksAssignedToSpecificUser(
  userIdentifier,
  taskListIdentifier,
  status,
  sortBy,
  filterBy,
) {
  closeAddForm();
  if (taskListIdentifier != undefined) {
    if (sortBy != undefined || filterBy != undefined) {
      return axios
        .get(
          `task/findTasksAssignedToSpecificUser?userId=${userIdentifier}&taskListId=${taskListIdentifier}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
        )
        .then(response => response.data)
        .catch(error => {
          throw error;
        });
    }
    return axios
      .get(
        `task/findTasksAssignedToSpecificUser?userId=${userIdentifier}&taskListId=${taskListIdentifier}&status=${status}`,
      )
      .then(response => response.data)
      .catch(error => {
        throw error;
      })
      .catch(error => {
        throw error;
      });
  }
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findTasksAssignedToSpecificUser?userId=${userIdentifier}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
  return axios
    .get(
      `task/findTasksAssignedToSpecificUser?userId=${userIdentifier}&status=${status}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getCountOfTasksAssignedToSpecificUser(
  userIdentifier,
  taskListIdentifier,
  status = 'COMPLETE',
  filterBy,
) {
  return axios
    .get(`task/findCountOfTasksAssignedToSpecificUser`, {
      params: {
        userId: userIdentifier,
        status,
        filterBy: filterBy || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getTasksAssignedByMe(
  taskListIdentifier,
  status,
  sortBy,
  filterBy,
) {
  closeAddForm();

  return axios({
    method: 'get',
    url: `task/findTasksAssignedByUser`,
    params: {
      taskListIdentifier,
      status,
      sortBy,
      filterBy,
    },
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function getCountOfTasksAssignedByMe(
  taskListIdentifier,
  status = 'COMPLETE',
  filterBy,
) {
  return axios
    .get(`task/findCountOfTasksAssignedByUser`, {
      params: {
        status,
        filterBy: filterBy || undefined,
      },
    })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function searchTasks(searchTerm, status, sortBy, filterBy) {
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/searchTasks?searchTerm=${searchTerm}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        throw error;
      });
  }
  return axios
    .get(`task/searchTasks?searchTerm=${searchTerm}&status=${status}`)
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
      toggleAlert('Error in creating task. Please try again.', 'error');
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
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}

export function deleteTask(taskIdentifier) {
  return axios
    .delete(`task/deleteTaskById/${taskIdentifier}`)
    .then(response => {
      return response;
    })
    .catch(error => {
      throw error;
    });
}

export function duplicateTask(taskIdentifier) {
  return axios
    .put(`task/duplicateTask/${taskIdentifier}`)
    .then(response => {
      toggleAlert('Task duplicated', 'success');
      return response.data;
    })
    .catch(error => {
      toggleAlert('Error in duplicating comment. Please try again.', 'error');
      throw error;
    });
}

export function sortSubTask(taskIdentifier, direction) {
  return axios
    .put(`task/sortSubTask/${taskIdentifier}/${direction}`)
    .then(response => {
      toggleAlert('Sub Task order changed', 'success');
      return response.data;
    })
    .catch(error => {
      toggleAlert(
        'Error in changing sub task order. Please try again.',
        'error',
      );
      throw error;
    });
}

export function markComplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskIdentifier}?status=COMPLETE`)
    .then(response => {
      // toggleAlert('Task completed. Great job!', 'success');
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
      // toggleAlert('You have re-activated a task.', 'success');
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
      // toggleAlert('Task description updated successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      throw new Error(error?.response?.data);
    });
}

export const updateDueDate = (taskIdentifier, dueDate) => {
  return axios
    .put(
      `task/addOrUpdateDueDate/${taskIdentifier}`,
      {},
      {
        params: {
          dueDate: dueDate ? dueDate.format('MM/DD/YYYY 00:00:00 ZZ') : null,
        },
      },
    )
    .catch(error => error?.response?.data);
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
  return axios
    .put(
      `task/addOrUpdateTaskAssignment/${taskIdentifier}?assignedToUserId=${assignedToUserIdentifier}`,
    )
    .then(response => {
      toggleAlert('Task assigned successfully', 'success');
      return response.data;
    })
    .catch(error => {
      toggleAlert('Error in task assignment. Please try again.', 'error');
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
      toggleAlert('Comment deleted', 'success');
      return response;
    })
    .catch(error => {
      toggleAlert('Error in deleting comment. Please try again.', 'error');
      throw error;
    });
}

export function updateComment(comment) {
  return axios
    .put('task/comment', comment)
    .then(response => {
      toggleAlert('Comment updated', 'success');
      return response;
    })
    .catch(error => {
      toggleAlert('Error in updating comment. Please try again.', 'error');
      throw error;
    });
}

export function getHighPriorityTasksByTaskList(taskListIdentifier) {
  return axios
    .get(`task/findHighPriorityListTasks/${taskListIdentifier}?startPosition=0`)
    .then(response => response.data)
    .catch(error => {
      toggleAlert(ERROR_RETRIEVING_TASKS_MESSAGE, 'error');
      throw error;
    });
}

export function getListTasksByPatient(
  patientIdentifier,
  status,
  taskListIdentifier,
) {
  return axios
    .get(
      `task/findListTasksByPatient/${patientIdentifier}/taskList/${taskListIdentifier}?status=${status}`,
    )
    .then(response => response.data)
    .catch(error => {
      toggleAlert(ERROR_RETRIEVING_TASKS_MESSAGE, 'error');
      throw error;
    });
}

export function getAllTasksByPatient(
  patientIdentifier,
  status,
  sortBy,
  filterBy,
) {
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findAllListTasksByPatient/${patientIdentifier}?status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        toggleAlert(ERROR_RETRIEVING_TASKS_MESSAGE, 'error');
        throw error;
      });
  }
  return axios
    .get(`task/findAllListTasksByPatient/${patientIdentifier}?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      toggleAlert(ERROR_RETRIEVING_TASKS_MESSAGE, 'error');
      throw error;
    });
}

export function getInboxTasks(
  status,
  sortBy,
  filterBy,
  queryStartPosition = 0,
) {
  return axios
    .get(`task/findInboxTasks`, {
      params: {
        status,
        queryStartPosition,
        sortBy,
        filterBy,
      },
    })
    .then(response => response.data)
    .catch(error => {
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
      toggleAlert('Attachment added successfully!', 'success');
      return response;
    })
    .catch(error => {
      if (error.response && error.response.status === 413) {
        toggleAlert('File exceeded the allowed size of 100 MB', 'error');
      } else {
        toggleAlert('Error in saving attachment. Please try again.', 'error');
      }
      throw error;
    });
}

export function removeTaskAttachment(taskAttachmentId) {
  return axios
    .delete(`task/attachment/${taskAttachmentId}`)
    .then(response => {
      toggleAlert('Attachment removed successfully!', 'success');
      return response;
    })
    .catch(error => {
      toggleAlert('Error in removing attachment. Please try again.', 'error');
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
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
export function flagArchivedForUser(taskIdentifier, flagArchived) {
  return axios
    .put(
      `task/flagUserTaskAsArchived/${taskIdentifier}?flagArchived=${flagArchived}`,
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}

export function reorderTasksInGroup(orderedTaskIds, taskGroupIdentifier) {
  return axios
    .put('task/sortTasksInTaskGroup', {
      taskIdentifiers: orderedTaskIds,
      taskGroupIdentifier,
    })
    .then(response => response.data)
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
    .then(response => response.data)
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
  selectedFilters,
) {
  return axios
    .post(
      `task/filter/filterTasksByCriteria/${taskListIdentifier}?status=${status}`,
      selectedFilters,
    )
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
}
