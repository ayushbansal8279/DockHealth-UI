import axios from './axios-heydoc';

/**
 * Get all tasks for a user
 */
export function getTasksForCreator(userId) {
  userId = sessionStorage.userId;
  return axios
    .get('task/findTasksCreatedByUser')
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getListTasksByUser(taskListId, status, sortBy, filterBy) {
  closeAddForm();
  if (sortBy == undefined && filterBy == undefined) {
    return axios
      .get(
        `task/findListTasksByUser/${taskListId}?status=${status}&queryStartPosition=0`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  return axios
    .get(
      `task/findListTasksByUser/${taskListId}?status=${status}&queryStartPosition=0&sortBy=${sortBy}&filterBy=${filterBy}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getTasksAssignedToMe(taskListId, status, sortBy, filterBy) {
  closeAddForm();
  if (taskListId != undefined) {
    if (sortBy != undefined || filterBy != undefined) {
      return axios
        .get(
          `task/findTasksAssignedToUser?taskListId=${taskListId}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.log(error);
          return error.response.data;
        });
    }
    return axios
      .get(
        `task/findTasksAssignedToUser?taskListId=${taskListId}&status=${status}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      })
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findTasksAssignedToUser?status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  return axios
    .get(`task/findTasksAssignedToUser?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getTasksAssignedToSpecificUser(
  userId,
  taskListId,
  status,
  sortBy,
  filterBy,
) {
  closeAddForm();
  if (taskListId != undefined) {
    if (sortBy != undefined || filterBy != undefined) {
      return axios
        .get(
          `task/findTasksAssignedToSpecificUser?userId=${userId}&taskListId=${taskListId}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.log(error);
          return error.response.data;
        });
    }
    return axios
      .get(
        `task/findTasksAssignedToSpecificUser?userId=${userId}&taskListId=${taskListId}&status=${status}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      })
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findTasksAssignedToSpecificUser?userId=${userId}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  return axios
    .get(
      `task/findTasksAssignedToSpecificUser?userId=${userId}&status=${status}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function getTasksAssignedByMe(taskListId, status, sortBy, filterBy) {
  closeAddForm();
  if (taskListId != undefined) {
    if (sortBy != undefined || filterBy != undefined) {
      return axios
        .get(
          `task/findTasksAssignedByUser?taskListId=${taskListId}&status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
        )
        .then(response => response.data)
        .catch(error => {
          console.log(error);
          return error.response.data;
        });
    }
    return axios
      .get(
        `task/findTasksAssignedByUser?taskListId=${taskListId}&status=${status}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findTasksAssignedByUser?status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        return error.response.data;
      });
  }
  return axios
    .get(`task/findTasksAssignedByUser?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
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
        console.log(error);
        return error.response.data;
      });
  }
  return axios
    .get(`task/searchTasks?searchTerm=${searchTerm}&status=${status}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      return error.response.data;
    });
}

export function addTask(task) {
  task.createdByUserId = sessionStorage.userId;
  return axios
    .post('task', task)
    .then(response => {
      toggleAlert('Task created successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in creating task. Please try again.', 'error');
      return error.response.data;
    });
}

export function updateTask(task) {
  task.createdByUserId = sessionStorage.userId;
  return axios
    .put(`task/${task.taskId}`, task)
    .then(response => {
      toggleAlert('Task updated successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating task. Please try again.', 'error');
      return error.response.data;
    });
}

export function deleteTask(taskId) {
  return axios
    .delete(`task/deleteTaskById/${taskId}`)
    .then(response => {
      toggleAlert('Task deleted', 'success');
      return response;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in deleting task. Please try again.', 'error');
      return error.response.data;
    });
}

export function duplicateTask(taskId) {
  return axios
    .put(`task/duplicateTask/${taskId}`)
    .then(response => {
      toggleAlert('Task duplicated', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in duplicating comment. Please try again.', 'error');
      return error.response.data;
    });
}

export function sortSubTask(taskId, direction) {
  return axios
    .put(`task/sortSubTask/${taskId}/${direction}`)
    .then(response => {
      toggleAlert('Sub Task order changed', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert(
        'Error in changing sub task order. Please try again.',
        'error',
      );
      return error.response.data;
    });
}

export function markComplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskId}?status=COMPLETE`)
    .then(response => {
      toggleAlert('Task completed. Great job!', 'success');
      return response;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating task. Please try again.', 'error');
      return error.response.data;
    });
}

export function markIncomplete(task) {
  return axios
    .put(`task/updateTaskStatus/${task.taskId}?status=INCOMPLETE`)
    .then(response => {
      toggleAlert('You have re-activated a task.', 'success');
      return response;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating task. Please try again.', 'error');
      return error.response.data;
    });
}

export function updateTaskDescription(task, description) {
  return axios
    .put(`task/${task.taskId}`, {
      // Fix overwriting other fields with null...
      ...task,
      patientId: task?.patient?.patientId,
      description,
    })
    .then(response => {
      toggleAlert('Task description updated successfully!', 'success');
      return response.data;
    })
    .catch(error => {
      toggleAlert('Error in updating task. Please try again.', 'error');
      throw error.response.data;
    });
}

export const updateDueDate = (taskId, dueDate) =>
  axios
    .put(
      `task/addOrUpdateDueDate/${taskId}?dueDate=${dueDate.format(
        'MM/DD/YYYY',
      )}`,
    )
    .catch(err => err.response.data);

/**
 * Updates task workflow status.
 * @param {number} taskId
 * @param {('BLOCKED'|'ON_HOLD'|'IN_PROGRESS')} workflowStatus
 * @returns {Promise}
 */
export const updateWorkflowStatus = (taskId, workflowStatus) =>
  axios
    .put(
      `task/updateTaskWorkflowStatus/${taskId}?workflowStatus=${workflowStatus}`,
    )
    .catch(err => err.response.data);

export function markHighPriority(taskId, userId) {
  return axios
    .put(`task/changePriority/${taskId}?userId=${userId}&priorityLevel=HIGH`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating task. Please try again.', 'error');
      throw error;
    });
}

export function markLowPriority(taskId, userId) {
  return axios
    .put(`task/changePriority/${taskId}?userId=${userId}&priorityLevel=LOW`)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in updating task. Please try again.', 'error');
      throw error;
    });
}

export function assignOrReassignTask(taskId, assignedToUserId) {
  return axios
    .put(
      `task/addOrUpdateTaskAssignment/${taskId}?assignedToUserId=${assignedToUserId}`,
    )
    .then(response => {
      toggleAlert('Task assigned successfully', 'success');
      return response.data;
    })
    .catch(error => {
      console.log(error);
      toggleAlert('Error in task assignment. Please try again.', 'error');
      throw error;
    });
}

export function addComment(taskId, taskComment) {
  return axios
    .post(`task/comment/${taskId}`, taskComment)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export function deleteComment(commentId) {
  return axios
    .delete(`task/comment/deleteCommentById/${commentId}`)
    .then(response => {
      toggleAlert('Comment deleted', 'success');
      return response;
    })
    .catch(error => {
      console.log(error);
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
      console.log(error);
      toggleAlert('Error in updating comment. Please try again.', 'error');
      throw error;
    });
}

export function getHighPriorityTasksByTaskList(taskListId) {
  return axios
    .get(`task/findHighPriorityListTasks/${taskListId}?startPosition=0`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      toggleAlert('Error in retrieving tasks. Please try again.', 'error');
      throw error;
    });
}

export function getListTasksByPatient(patientId, status, taskListId) {
  return axios
    .get(
      `task/findListTasksByPatient/${patientId}/taskList/${taskListId}?status=${status}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      toggleAlert('Error in retrieving tasks. Please try again.', 'error');
      throw error;
    });
}

export function getAllTasksByPatient(patientId, status, sortBy, filterBy) {
  if (sortBy != undefined || filterBy != undefined) {
    return axios
      .get(
        `task/findAllListTasksByPatient/${patientId}?status=${status}&sortBy=${sortBy}&filterBy=${filterBy}`,
      )
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        toggleAlert('Error in retrieving tasks. Please try again.', 'error');
        throw error;
      });
  }
  return axios
    .get(`task/findAllListTasksByPatient/${patientId}?status=${status}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      toggleAlert('Error in retrieving tasks. Please try again.', 'error');
      throw error;
    });
}

export function getInboxTasks(status, sortBy, filterBy) {
  if (sortBy == undefined && filterBy == undefined) {
    closeAddForm();
    return axios
      .get(`task/findInboxTasks?status=${status}&queryStartPosition=0`)
      .then(response => response.data)
      .catch(error => {
        console.log(error);
        throw error;
      });
  }
  return axios
    .get(
      `task/findInboxTasks?status=${status}&queryStartPosition=0&sortBy=${sortBy}&filterBy=${filterBy}`,
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export function flagUnread(taskId, flagUnread) {
  return axios
    .put(`task/flagUserTaskAsUnread/${taskId}?flagUnread=${flagUnread}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export function getTaskHistory(taskId) {
  return axios
    .get(`audit/findAuditsByTask/${taskId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
}

export function addTaskAttachment(taskId, fileData) {
  const formData = new FormData();
  formData.append('file', fileData);
  // var fileDataToPost = {
  //   file: fileData
  // }
  return axios
    .post(`task/attachment/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      toggleAlert('Attachment added successfully!', 'success');
      return response;
    })
    .catch(function(error) {
      console.log(error);
      toggleAlert('Error in saving attachment. Please try again.', 'error');
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
    .catch(function(error) {
      console.log(error);
      toggleAlert('Error in removing attachment. Please try again.', 'error');
      throw error;
    });
}

export function flagArchivedForUser(taskId, flagArchived) {
  return axios
    .put(`task/flagUserTaskAsArchived/${taskId}?flagArchived=${flagArchived}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
}
