import moment from 'moment';

import * as TaskApi from '../api/task-api';
import * as ActionTypes from './action-types';
import * as TaskListActions from './tasklist-actions';

const shapeTask = task => {
  const { assignedTo, patient } = task;

  return {
    ...task,
    assignedToId: assignedTo ? assignedTo.userId : null,
    patientId: patient ? patient.patientId : null,
  };
};

function getTasksForCreatorSuccess(tasks) {
  return { type: ActionTypes.GET_TASKS_SUCCESS, tasks };
}

export function getTasksForCreator(userId) {
  return dispatch =>
    TaskApi.getTasksForCreator(userId)
      .then(tasks => {
        dispatch(getTasksForCreatorSuccess(tasks));
      })
      .catch(error => {
        throw error;
      });
}

export function getListTasks(taskListId, sortBy, filterBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getListTasksByUser(taskListId, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedToMe(taskListId, sortBy, filterBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getTasksAssignedToMe(taskListId, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedToSpecificUser(
  userId,
  taskListId,
  sortBy,
  filterBy,
  status,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getTasksAssignedToSpecificUser(
      userId,
      taskListId,
      status,
      sortBy,
      filterBy,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedByMe(taskListId, sortBy, filterBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getTasksAssignedByMe(taskListId, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function searchTasks(searchTerm, sortBy, filterBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.searchTasks(searchTerm, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function loading() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_TASKS });
  };
}

export function loadingCompletedTasks() {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_COMPLETED_TASKS });
  };
}

export function hideCompletedTasks() {
  return dispatch => {
    dispatch({ type: ActionTypes.HIDE_COMPLETED_TASKS });
  };
}

export function getHighPriorityTasksByTaskList(taskListId) {
  return dispatch =>
    TaskApi.getHighPriorityTasksByTaskList(taskListId)
      .then(tasks => {
        dispatch({ type: ActionTypes.GET_TASKS_SUCCESS, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export const clearPreparedSubtask = () => dispatch => {
  dispatch({
    type: ActionTypes.CHANGE_ADDING_NEW_SUBTASK,
    addingNewSubtask: false,
    addingNewSubtaskParentId: null,
    subtaskShape: {},
  });
};

export const reloadTaskListStats = (dispatch, task) => {
  if (task.taskList) {
    TaskListActions.getTaskListStats(task.taskList)(dispatch);
  }
};

export function saveTask(newTask) {
  if (newTask.taskId) {
    return dispatch =>
      TaskApi.updateTask(newTask)
        .then(task => {
          dispatch({ type: ActionTypes.UPDATE_TASK_SUCCESS, task });
          reloadTaskListStats(dispatch, task);
          return task;
        })
        .catch(error => {
          throw error;
        });
  }

  return dispatch => {
    if (!newTask.taskId && !newTask.parentTaskId) {
      dispatch({
        type: ActionTypes.CHANGE_ADDING_NEW_TASK,
        addingNewTask: true,
      });
    }
    return TaskApi.addTask(newTask)
      .then(task => {
        if (!task.taskList) {
          dispatch({
            type: ActionTypes.ADD_TASK_SUCCESS,
            task: { ...task, taskList: { listName: 'Inbox', taskListId: 0 } },
          });
          dispatch({
            type: ActionTypes.CHANGE_ADDING_NEW_TASK,
            addingNewTask: false,
          });
          reloadTaskListStats(dispatch, task);
        } else {
          dispatch({ type: ActionTypes.ADD_TASK_SUCCESS, task });
          dispatch({
            type: ActionTypes.CHANGE_ADDING_NEW_TASK,
            addingNewTask: false,
          });
          reloadTaskListStats(dispatch, task);
        }

        clearPreparedSubtask()(dispatch);

        return task;
      })
      .catch(error => {
        throw error;
      });
  };
}

export const moveTask = (task, taskList) => dispatch => {
  const updatedTask = {
    ...shapeTask(task),
    refiled: true,
    taskList: taskList.listName,
    taskListId: taskList.taskListId,
  };

  return TaskApi.updateTask(updatedTask)
    .then(() => {
      dispatch({ type: ActionTypes.MOVE_TASK_SUCCESS, task, taskList });
      reloadTaskListStats(dispatch, task);
    })
    .catch(error => {
      throw error;
    });
};

export const moveTaskBetweenLists = task => dispatch => {
  dispatch({
    type: ActionTypes.MOVE_TASK_BETWEEN_LISTS,
    task,
  });
  reloadTaskListStats(dispatch, task);
};

export function addTaskComment(task, taskComment) {
  return dispatch =>
    TaskApi.addComment(task.taskId, taskComment)
      .then(comment => {
        dispatch({ type: ActionTypes.ADD_TASK_COMMENT_SUCCESS, task, comment });
        return comment;
      })
      .catch(error => {
        throw error;
      });
}

export function deleteComment(task, comment) {
  return dispatch =>
    TaskApi.deleteComment(comment.commentId)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_TASK_COMMENT_SUCCESS,
          task,
          comment,
        });
      })
      .catch(error => {
        throw error;
      });
}

export function updateComment(task, comment) {
  return dispatch =>
    TaskApi.updateComment(comment)
      .then(({ data }) => {
        dispatch({
          type: ActionTypes.UPDATE_TASK_COMMENT_SUCCESS,
          task,
          comment: data,
        });
      })
      .catch(error => {
        throw error;
      });
}

export function deleteTask(task) {
  return dispatch =>
    TaskApi.deleteTask(task.taskId)
      .then(() => {
        dispatch({ type: ActionTypes.DELETE_TASK_SUCCESS, task });
        reloadTaskListStats(dispatch, task);
      })
      .catch(error => {
        throw error;
      });
}

export function duplicateTask(task) {
  return dispatch =>
    TaskApi.duplicateTask(task.taskId)
      .then(duplicatedTask => {
        dispatch({ type: ActionTypes.DUPLICATE_TASK_SUCCESS, duplicatedTask });
        reloadTaskListStats(dispatch, task);
        return duplicatedTask;
      })
      .catch(error => {
        throw error;
      });
}

export function sortSubTask(task, direction) {
  return dispatch =>
    TaskApi.sortSubTask(task.taskId, direction)
      .then(() => {
        dispatch({ type: ActionTypes.ORDER_SUB_TASK_SUCCESS, task });
      })
      .catch(error => {
        throw error;
      });
}

export function markComplete(task, status, listName, currentUser = null) {
  const action =
    listName === 'INCOMPLETE'
      ? ActionTypes.MARK_TASK_STATUS_SUCCESS
      : ActionTypes.MARK_COMPLETE_TASK_STATUS_SUCCESS;

  return dispatch => {
    const { newStatus, apiEndpoint } =
      status === 'INCOMPLETE'
        ? { newStatus: 'COMPLETE', apiEndpoint: 'markComplete' }
        : { newStatus: 'INCOMPLETE', apiEndpoint: 'markIncomplete' };

    return TaskApi[apiEndpoint](task)
      .then(() => {
        const newTaskData = {
          status: newStatus,
          completedBy:
            newStatus === 'COMPLETE'
              ? currentUser ?? task.completedBy
              : task.completedBy,
          completedDt:
            newStatus === 'COMPLETE'
              ? moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
              : task.completedBy,
        };

        dispatch({
          type: action,
          task,
          ...newTaskData,
        });
        reloadTaskListStats(dispatch, task);

        return {
          ...task,
          ...newTaskData,
        };
      })
      .catch(error => {
        throw error;
      });
  };
}

export const updateTaskDescription = (task, description) => dispatch =>
  TaskApi.updateTaskDescription(task, description)
    .then(res => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS,
        task,
        description: res.description,
      });
    })
    .catch(error => {
      throw error;
    });

export const updateDueDate = (task, dueDate) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, dueDate }))
    .then(res => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_DUE_DATE,
        taskId: res.taskId,
        dueDate: res.dueDate,
      });
      reloadTaskListStats(dispatch, task);
    })
    .catch(() => {});

export const updatePatient = (task, patient) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, patient }))
    .then(res => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_PATIENT,
        parentTaskId: res.parentTaskId || res.taskId,
        patient: res.patient,
      });
    })
    .catch(err => {
      throw err;
    });

export const updateReminder = (task, reminderDt) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, reminderDt }))
    .then(() => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_REMINDER,
        taskId: task.taskId,
        reminderDt,
      });
    })
    .catch(err => {
      throw err;
    });

export const updateWorkflowStatus = (task, workflowStatus) => dispatch => {
  const { taskId } = task;
  return TaskApi.updateWorkflowStatus(taskId, workflowStatus)
    .then(() => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_WORKFLOW_STATUS,
        taskId,
        workflowStatus,
      });
      reloadTaskListStats(dispatch, task);
    })
    .catch(err => {
      throw err;
    });
};

export function toggleTaskPriority(task, userId, priority) {
  return dispatch => {
    const { newPriority, apiEndpoint } =
      priority === 'LOW'
        ? { newPriority: 'HIGH', apiEndpoint: 'markHighPriority' }
        : { newPriority: 'LOW', apiEndpoint: 'markLowPriority' };

    return TaskApi[apiEndpoint](task.taskId, userId, priority)
      .then(() => {
        dispatch({
          type: ActionTypes.TOGGLE_TASK_PRIORITY_SUCCESS,
          task,
          priority: newPriority,
        });
        reloadTaskListStats(dispatch, task);
      })
      .catch(error => {
        throw error;
      });
  };
}

export function assignOrReassignTask(task, assignedToUserId) {
  return dispatch =>
    TaskApi.assignOrReassignTask(task, assignedToUserId)
      .then(assignedTask => {
        dispatch({
          type: ActionTypes.ASSIGN_OR_REASSIGN_TASK_SUCCESS,
          task: assignedTask,
        });
        reloadTaskListStats(dispatch, assignedTask);
      })
      .catch(error => {
        throw error;
      });
}

export function getListTasksByPatient(patientId, taskListId) {
  return dispatch =>
    TaskApi.getListTasksByPatient(patientId, 'INCOMPLETE', taskListId)
      .then(tasks => {
        dispatch({ type: ActionTypes.GET_TASKS_SUCCESS, tasks });
        TaskApi.getListTasksByPatient(patientId, 'COMPLETE', taskListId).then(
          patientsTasks => {
            dispatch({
              type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS,
              tasks: patientsTasks,
            });
          },
        );
      })
      .catch(error => {
        throw error;
      });
}
export function getAllTasksByPatient(patientId, sortBy, filterBy, status) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getAllTasksByPatient(patientId, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function getInboxTasks(status, sortBy, filterBy) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getInboxTasks(status, sortBy, filterBy)
      .then(tasks => {
        const taskList = { listName: 'Inbox', taskListId: 0 };
        const tasksWithFixedTaskList = tasks.map(task => ({
          ...task,
          taskList,
          subtasks: task.subtasks.map(subtask => ({ ...subtask, taskList })),
        }));
        dispatch({ type: action, tasks: tasksWithFixedTaskList });
      })
      .catch(error => {
        throw error;
      });
}

export function markAsUnread(currentTask, flagUnread) {
  return dispatch =>
    TaskApi.flagUnread(currentTask.taskId, flagUnread)
      .then(task => {
        dispatch({
          type: ActionTypes.FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS,
          task,
          flagUnread,
        });
      })
      .catch(error => {
        throw error;
      });
}

export function taskToState(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.EDIT_TASK, task });
  };
}

export function storeAsCurrentTask(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_AS_CURRENT_TASK, task });
    if ((task && task.taskId !== null) || task == null) {
      clearPreparedSubtask()(dispatch);
    }
  };
}

export const prepareSubtask = parentTaskId => dispatch => {
  const subtaskShape = {
    taskId: null,
    parentTaskId,
    description: '',
    subtasks: [],
  };

  dispatch({
    type: ActionTypes.CHANGE_ADDING_NEW_SUBTASK,
    addingNewSubtask: true,
    addingNewSubtaskParentId: parentTaskId,
    subtaskShape,
  });
  storeAsCurrentTask(subtaskShape)(dispatch);
};

export function getTaskHistory(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_HISTORY });

    return TaskApi.getTaskHistory(task.taskId)
      .then(auditDetails => {
        dispatch({ type: ActionTypes.GET_TASK_HISTORY_SUCCESS, auditDetails });
        return auditDetails;
      })
      .catch(error => {
        dispatch({ type: ActionTypes.GET_TASK_HISTORY_ERROR, error });
        throw error;
      });
  };
}

export function clearCurrentTaskHistory() {
  return dispatch => {
    dispatch({ type: ActionTypes.CLEAR_CURRENT_TASK_HISTORY });
  };
}

export const addTaskAttachment = (taskId, fileData) => dispatch =>
  TaskApi.addTaskAttachment(taskId, fileData)
    .then(res => {
      dispatch({
        type: ActionTypes.TASK_ATTACHMENT_ADDED,
        taskId,
        taskAttachment: res.data,
      });
    })
    .catch(err => {
      throw err;
    });

export const removeTaskAttachment = (taskId, taskAttachmentId) => dispatch =>
  TaskApi.removeTaskAttachment(taskAttachmentId)
    .then(() => {
      dispatch({
        type: ActionTypes.TASK_ATTACHMENT_REMOVED,
        taskId,
        taskAttachmentId,
      });
    })
    .catch(err => {
      throw err;
    });

export const archiveTask = (task, currentUserProfile) => dispatch =>
  TaskApi.flagArchivedForUser(task.taskId, true)
    .then(responseTask => {
      dispatch({
        type: ActionTypes.TASK_ARCHIVED,
        task: responseTask,
        currentUserProfile,
      });
      reloadTaskListStats(dispatch, task);
    })
    .catch(error => {
      throw error;
    });
