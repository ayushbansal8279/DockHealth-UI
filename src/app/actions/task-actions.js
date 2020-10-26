/* eslint-disable sonarjs/no-duplicate-string */
import moment from 'moment';
import { curry } from 'ramda';
import * as TaskApi from 'api/task-api';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import * as AlertActions from 'alert/actions';
// eslint-disable-next-line import/no-cycle
import { getTasksGroupsList } from 'sagas/list-details-saga';
import { openDrawer } from 'actions/task-drawer-actions';
import * as ActionTypes from './action-types';
// import * as TaskListActions from './tasklist-actions';
import AlertMessages from '../alert/AlertMessages';

export const clearPreparedSubtask = curry(dispatch =>
  dispatch({
    type: ActionTypes.CHANGE_ADDING_NEW_SUBTASK,
    addingNewSubtask: false,
    addingNewSubtaskParentId: null,
    subtaskShape: {},
  }),
);

export function storeAsCurrentTask(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_AS_CURRENT_TASK, task });
    if ((task && task.taskIdentifier !== null) || task == null) {
      clearPreparedSubtask(dispatch);
    }
  };
}

const shapeTask = task => {
  const { assignedTo, patient } = task;

  return {
    ...task,
    assignedToIdentifier: assignedTo ? assignedTo.userIdentifier : null,
    patientIdentifier: patient ? patient.patientIdentifier : null,
  };
};

const getListAction = ({ status, cumulativeFlag }) => {
  if (status === 'INCOMPLETE') {
    return ActionTypes.GET_TASKS_SUCCESS;
  }

  return cumulativeFlag
    ? ActionTypes.GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE
    : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;
};

function getTasksForCreatorSuccess(tasks) {
  return { type: ActionTypes.GET_TASKS_SUCCESS, tasks };
}

export function getTasksForCreator(userIdentifier) {
  return dispatch =>
    TaskApi.getTasksForCreator(userIdentifier)
      .then(tasks => {
        dispatch(getTasksForCreatorSuccess(tasks));
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getListTasks(
  taskListIdentifier,
  sortBy,
  filterBy,
  status,
  cumulativeFlag,
  queryStartPosition = 0,
) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch => {
    if (cumulativeFlag) {
      dispatch({ type: ActionTypes.GET_MORE_TASKS_REQUEST });
    }

    return TaskApi.getListTasksByUser(
      taskListIdentifier,
      status,
      sortBy,
      filterBy,
      queryStartPosition,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });

        const selectedTaskIdentifier = sessionStorage.getItem(
          'selectedTaskIdentifier',
        );

        const selectedTask = tasks.find(
          ({ taskIdentifier }) => taskIdentifier === selectedTaskIdentifier,
        );

        if (selectedTask) {
          dispatch(storeAsCurrentTask(selectedTask));
          dispatch(openDrawer());
          sessionStorage.removeItem('selectedTaskIdentifier');
        }

        return tasks;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getListTasksCount(taskListIdentifier, filterBy, status) {
  const action = ActionTypes.GET_TASKS_COUNT_SUCCESS;

  return dispatch =>
    TaskApi.getListTasksCountByUser(taskListIdentifier, status, filterBy)
      .then(stats => {
        dispatch({ type: action, stats });
        return stats;
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedToMe(
  taskListIdentifier,
  sortBy,
  filterBy,
  status,
  cumulativeFlag,
) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch =>
    TaskApi.getTasksAssignedToMe(taskListIdentifier, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getCountOfTasksAssignedToMe(
  taskListIdentifier,
  filterBy,
  status,
) {
  const action = ActionTypes.GET_TASKS_COUNT_SUCCESS;

  return dispatch =>
    TaskApi.getCountOfTasksAssignedToMe(taskListIdentifier, status, filterBy)
      .then(stats => {
        dispatch({ type: action, stats });
        return stats;
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedToSpecificUser(
  userIdentifier,
  taskListIdentifier,
  sortBy,
  filterBy,
  status,
  cumulativeFlag,
) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch =>
    TaskApi.getTasksAssignedToSpecificUser(
      userIdentifier,
      taskListIdentifier,
      status,
      sortBy,
      filterBy,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getCountOfTasksAssignedToSpecificUser(
  userIdentifier,
  taskListIdentifier,
  filterBy,
  status,
) {
  const action = ActionTypes.GET_TASKS_COUNT_SUCCESS;

  return dispatch =>
    TaskApi.getCountOfTasksAssignedToSpecificUser(
      userIdentifier,
      taskListIdentifier,
      status,
      filterBy,
    )
      .then(stats => {
        dispatch({ type: action, stats });
        return stats;
      })
      .catch(error => {
        throw error;
      });
}

export function getTasksAssignedByMe(
  taskListIdentifier,
  sortBy,
  filterBy,
  status,
  cumulativeFlag,
) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch =>
    TaskApi.getTasksAssignedByMe(taskListIdentifier, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getCountOfTasksAssignedByMe(
  taskListIdentifier,
  filterBy,
  status,
) {
  const action = ActionTypes.GET_TASKS_COUNT_SUCCESS;

  return dispatch =>
    TaskApi.getCountOfTasksAssignedByMe(taskListIdentifier, status, filterBy)
      .then(stats => {
        dispatch({ type: action, stats });
        return stats;
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
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function clearSearchTasks({ status }) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch => {
    dispatch({ type: action, tasks: [] });
    return [];
  };
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
export function resetTaskSearch() {
  return dispatch => {
    dispatch({ type: ActionTypes.CLEAR_TASKS_SEARCH });
  };
}

export function hideCompletedTasks() {
  return dispatch => {
    dispatch({ type: ActionTypes.HIDE_COMPLETED_TASKS });
  };
}

export function getHighPriorityTasksByTaskList(taskListIdentifier) {
  return dispatch =>
    TaskApi.getHighPriorityTasksByTaskList(taskListIdentifier)
      .then(tasks => {
        dispatch({ type: ActionTypes.GET_TASKS_SUCCESS, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export const reloadTaskListStats = (dispatch, task) => {
  if (task.taskList) {
    // Do Nothing
    // TaskListActions.getTaskListStats(task.taskList)(dispatch);
  }
};

export function saveTask(newTask, shouldReloadGroups = false) {
  if (newTask.taskIdentifier) {
    return dispatch =>
      TaskApi.updateTask(newTask)
        .then(task => {
          dispatch({
            type: ActionTypes.UPDATE_TASK_SUCCESS,
            task,
          });
          reloadTaskListStats(dispatch, task);
          return task;
        })
        .catch(error => {
          throw error;
        });
  }

  return dispatch => {
    if (!newTask.taskIdentifier && !newTask.parentTaskIdentifier) {
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
            task: {
              ...task,
              taskList: { listName: 'Inbox', taskListIdentifier: '' },
            },
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
          if (shouldReloadGroups) {
            dispatch(
              getTasksGroupsList({
                taskListIdentifier: newTask.taskListIdentifier,
              }),
            );
          }
          reloadTaskListStats(dispatch, task);
        }

        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
        clearPreparedSubtask(dispatch);

        return task;
      })
      .catch(error => {
        throw error;
      });
  };
}
export const moveTask = (task, taskList) => dispatch => {
  const updatedTask = {
    refiled: true,
    ...shapeTask(task),
    taskList,
    taskListIdentifier: taskList.taskListIdentifier,
  };

  return TaskApi.updateTask(updatedTask)
    .then(() => {
      dispatch({
        type: ActionTypes.MOVE_TASK_SUCCESS,
        task,
        taskList,
      });
      reloadTaskListStats(dispatch, task);
    })
    .catch(error => {
      throw error;
    });
};

export function addComment(task, taskComment) {
  return dispatch =>
    TaskApi.addComment(task.taskIdentifier, taskComment)
      .then(comment => {
        dispatch({
          type: ActionTypes.ADD_TASK_COMMENT_SUCCESS,
          task,
          comment,
        });
        return comment;
      })
      .catch(error => {
        throw error;
      });
}

export function deleteComment(task, comment) {
  return dispatch =>
    TaskApi.deleteComment(comment.commentIdentifier)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_TASK_COMMENT_SUCCESS,
          task,
          comment,
        });
        return {
          task,
          comment,
        };
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
        return {
          task,
          comment,
        };
      })
      .catch(error => {
        throw error;
      });
}

export function deleteTask(task) {
  return dispatch =>
    TaskApi.deleteTask(task.taskIdentifier)
      .then(() => {
        dispatch({ type: ActionTypes.DELETE_TASK_SUCCESS, task });
        reloadTaskListStats(dispatch, task);
        dispatch(AlertActions.showGlobalAlert(AlertMessages.DELETED));
        return task;
      })
      .catch(error => {
        throw error;
      });
}

export function duplicateTask(task, includeAttachments) {
  return dispatch =>
    TaskApi.duplicateTask(task.taskIdentifier, includeAttachments)
      .then(duplicatedTask => {
        dispatch({
          type: ActionTypes.DUPLICATE_TASK_SUCCESS,
          duplicatedTask,
        });
        reloadTaskListStats(dispatch, task);
        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_DUPLICATED));
        return duplicatedTask;
      })
      .catch(error => {
        throw error;
      });
}

export function toggleCompleteTask(task, tabName, currentUser = null) {
  return dispatch => {
    const action =
      tabName === TaskListTabName.COMPLETE
        ? ActionTypes.MARK_COMPLETE_TASK_STATUS_SUCCESS
        : ActionTypes.MARK_TASK_STATUS_SUCCESS;

    const { apiEndpoint, newStatus, successMessage } =
      task.status === 'INCOMPLETE'
        ? {
            apiEndpoint: 'markComplete',
            newStatus: 'COMPLETE',
            successMessage: AlertMessages.TASK_COMPLETED,
          }
        : {
            apiEndpoint: 'markIncomplete',
            newStatus: 'INCOMPLETE',
            successMessage: AlertMessages.TASK_REACTIVATED,
          };

    const newTaskData = {
      status: newStatus,
      completedBy: newStatus === 'COMPLETE' ? currentUser : null,
      completedDt:
        newStatus === 'COMPLETE'
          ? moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          : null,
    };

    dispatch({
      type: action,
      task,
      ...newTaskData,
    });

    return TaskApi[apiEndpoint](task)
      .then(() => {
        dispatch(AlertActions.showGlobalAlert(successMessage));
      })
      .catch(error => {
        throw error;
      });
  };
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
  TaskApi.updateTaskDescription(shapeTask(task), description)
    .then(
      ({
        description: updatedDescription,
        tokenizedDescription,
        taskMentions,
      }) => {
        const newTask = task;
        newTask.description = updatedDescription;
        newTask.tokenizedDescription = tokenizedDescription;
        newTask.taskMentions = taskMentions;

        dispatch({
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task: newTask,
        });
      },
    )
    .catch(error => {
      throw error;
    });

export const updateDueDate = (
  task,
  dueDate,
  showGlobalConfirmation,
) => dispatch =>
  TaskApi.updateDueDate(task?.taskIdentifier, dueDate)
    .then(() => {
      const newTask = task;
      newTask.dueDate = moment(dueDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: newTask,
      });
      reloadTaskListStats(dispatch, task);
      if (showGlobalConfirmation) {
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      }
      return newTask;
    })
    .catch(() => {});

export const updatePatient = (task, patient) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, patient }))
    .then(response => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: response,
      });
      return response;
    })
    .catch(error => {
      throw error;
    });

export const updateReminder = (task, reminderDt) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, reminderDt }))
    .then(() => {
      const newTask = task;
      newTask.reminderDt = reminderDt;
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: newTask,
      });
    })
    .catch(error => {
      throw error;
    });

export const updateWorkflowStatus = (task, workflowStatus) => dispatch => {
  const { taskIdentifier } = task;
  const taskWorkflowStatus =
    workflowStatus === 'NO_STATUS' ? '' : workflowStatus;

  return TaskApi.updateWorkflowStatus(taskIdentifier, workflowStatus)
    .then(() => {
      const newTask = task;
      newTask.workflowStatus = taskWorkflowStatus;
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: newTask,
      });
      reloadTaskListStats(dispatch, task);
      dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      return newTask;
    })
    .catch(error => {
      throw error;
    });
};

export function toggleTaskPriority(task, priority) {
  return dispatch => {
    const { newPriority, apiEndpoint } =
      !priority ||
      priority === 'NONE' ||
      priority === 'LOW' ||
      priority === null
        ? { newPriority: 'LOW', apiEndpoint: 'markLowPriority' }
        : { newPriority: 'HIGH', apiEndpoint: 'markHighPriority' };

    return TaskApi[apiEndpoint](task.taskIdentifier, priority)
      .then(() => {
        const newTask = task;
        newTask.priority = newPriority;
        dispatch({
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task: newTask,
        });

        reloadTaskListStats(dispatch, task);
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));

        return task;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function assignOrReassignTask(task, assignedToUserIdentifier) {
  return dispatch =>
    TaskApi.assignOrReassignTask(task, assignedToUserIdentifier)
      .then(assignedTask => {
        dispatch({
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task: assignedTask,
        });
        dispatch({
          type: ActionTypes.SET_AS_CURRENT_TASK,
          task: assignedTask,
        });
        reloadTaskListStats(dispatch, assignedTask);
        return assignedTask;
      })
      .catch(error => {
        throw error;
      });
}

export function getListTasksByPatient(patientIdentifier, taskListIdentifier) {
  return dispatch =>
    TaskApi.getListTasksByPatient(
      patientIdentifier,
      'INCOMPLETE',
      taskListIdentifier,
    )
      .then(tasks => {
        dispatch({ type: ActionTypes.GET_TASKS_SUCCESS, tasks });
        TaskApi.getListTasksByPatient(
          patientIdentifier,
          'COMPLETE',
          taskListIdentifier,
        ).then(patientsTasks => {
          dispatch({
            type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS,
            tasks: patientsTasks,
          });
          return patientsTasks;
        });
      })
      .catch(error => {
        throw error;
      });
}

export function getListTasksByPatientAndStatus(
  patientIdentifier,
  taskListIdentifier,
  status,
  cumulativeFlag,
) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch =>
    TaskApi.getListTasksByPatient(patientIdentifier, status, taskListIdentifier)
      .then(tasks => {
        dispatch({ type: action, tasks });
      })
      .catch(error => {
        throw error;
      });
}

export function getAllTasksByPatient(
  patientIdentifier,
  sortBy,
  filterBy,
  status,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getAllTasksByPatient(patientIdentifier, status, sortBy, filterBy)
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

export function getInboxTasks(status, sortBy, filterBy, cumulativeFlag) {
  const action = getListAction({ status, cumulativeFlag });

  return dispatch =>
    TaskApi.getInboxTasks(status, sortBy, filterBy)
      .then(tasks => {
        const taskList = { listName: 'Inbox', taskListIdentifier: '' };
        const tasksWithFixedTaskList = tasks.map(task => ({
          ...task,
          taskList,
          subtasks: task.subtasks.map(subtask => ({ ...subtask, taskList })),
        }));
        dispatch({ type: action, tasks: tasksWithFixedTaskList });
        return tasksWithFixedTaskList;
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

export function storeAllTasks(tasks, completedTasks) {
  return dispatch => {
    if (tasks && tasks.length > 0) {
      dispatch({ type: ActionTypes.GET_TASKS_SUCCESS, tasks });
      return tasks;
    }
    if (completedTasks && completedTasks.length > 0) {
      dispatch({
        type: ActionTypes.GET_COMPLETED_TASKS_SUCCESS,
        tasks: completedTasks,
      });
      return completedTasks;
    }
    return [];
  };
}
export const prepareSubtask = (
  parentTaskIdentifier,
  assignedTo,
) => dispatch => {
  const subtaskShape = {
    taskIdentifier: null,
    parentTaskIdentifier,
    description: '',
    subtasks: [],
    assignedTo,
  };

  dispatch({
    type: ActionTypes.CHANGE_ADDING_NEW_SUBTASK,
    addingNewSubtask: true,
    addingNewSubtaskParentId: parentTaskIdentifier,
    subtaskShape,
  });
  storeAsCurrentTask(subtaskShape)(dispatch);
};

export function getTaskHistory(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.REQUEST_HISTORY });

    return TaskApi.getTaskHistory(task.taskIdentifier)
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

export const addTaskAttachment = (
  taskIdentifier,
  fileData,
  additionalConfig,
) => dispatch =>
  TaskApi.addTaskAttachment(taskIdentifier, fileData, additionalConfig)
    .then(response => {
      dispatch({
        type: ActionTypes.TASK_ATTACHMENT_ADDED,
        taskIdentifier,
        taskAttachment: response.data,
      });
      dispatch(AlertActions.showGlobalAlert(AlertMessages.ATTACHMENT_ADDED));

      return response.data;
    })
    .catch(error => {
      throw error;
    });

export const removeTaskAttachment = (
  taskIdentifier,
  taskAttachmentId,
) => dispatch =>
  TaskApi.removeTaskAttachment(taskAttachmentId)
    .then(() => {
      dispatch({
        type: ActionTypes.TASK_ATTACHMENT_REMOVED,
        taskIdentifier,
        taskAttachmentId,
      });
      dispatch(AlertActions.showGlobalAlert(AlertMessages.ATTACHMENT_REMOVED));
    })
    .catch(error => {
      throw error;
    });

export const refreshAnotherTask = selectedTask => dispatch =>
  TaskApi.getTaskDetails(selectedTask.taskIdentifier)
    .then(task => {
      // explicitly mark task as updated so we can show the flag
      task.updated = true; // eslint-disable-line no-param-reassign
      dispatch({
        type: ActionTypes.REFRESH_ANOTHER_TASK_SUCCESS,
        task,
      });
      reloadTaskListStats(dispatch, selectedTask);
      return task;
    })
    .catch(error => {
      throw error;
    });

export const refreshTask = selectedTask => dispatch =>
  TaskApi.getTaskDetails(selectedTask.taskIdentifier)
    .then(task => {
      // explicitly mark task as updated so we can show the flag
      task.updated = true; // eslint-disable-line no-param-reassign
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task,
      });
      reloadTaskListStats(dispatch, selectedTask);
      return task;
    })
    .catch(error => {
      throw error;
    });

export const refreshAndStoreAsCurrentTask = taskIdentifier => dispatch =>
  TaskApi.getTaskDetails(taskIdentifier)
    .then(task => {
      dispatch({
        type: ActionTypes.SET_AS_CURRENT_TASK,
        task,
      });
      return task;
    })
    .catch(error => {
      throw error;
    });

export const archiveTask = (task, currentUserProfile) => dispatch =>
  TaskApi.flagArchivedForUser(task.taskIdentifier, true)
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

const getTaskPagePromise = ({
  isInbox,
  status,
  sortBy,
  filterBy,
  queryStartPosition,
  taskListIdentifier,
  isAssignedByMeList,
  isAssignedToMeList,
}) => {
  if (isInbox) {
    return TaskApi.getInboxTasks(status, sortBy, filterBy, queryStartPosition);
  }

  if (isAssignedByMeList) {
    return TaskApi.getTasksAssignedByMe(
      taskListIdentifier,
      status,
      sortBy,
      filterBy,
    );
  }
  if (isAssignedToMeList) {
    return TaskApi.getTasksAssignedToMe(
      taskListIdentifier,
      status,
      sortBy,
      filterBy,
    );
  }

  return TaskApi.getListTasksByUser(
    taskListIdentifier,
    status,
    sortBy,
    filterBy,
    queryStartPosition,
  );
};

export const getTaskPage = ({
  taskListIdentifier,
  status,
  sortBy,
  filterBy,
  queryStartPosition = 0,
  search,
  isInbox = false,
  isAssignedByMeList = false,
  isAssignedToMeList = false,
}) => dispatch => {
  return getTaskPagePromise({
    isInbox,
    status,
    sortBy,
    filterBy,
    queryStartPosition,
    taskListIdentifier,
    isAssignedByMeList,
    isAssignedToMeList,
  })
    .then(tasks => {
      dispatch({
        type: ActionTypes.TASK_NEW_PAGE_DOWNLOADED,
        tasks: search(tasks),
        status,
        taskListIdentifier,
        queryStartPosition,
      });
    })
    .catch(error => {
      throw error;
    });
};

export const reorderTasksInGroup = (orderedTaskIds, taskGroupIdentifier) => {
  return dispatch => {
    return TaskApi.reorderTasksInGroup(orderedTaskIds, taskGroupIdentifier)
      .then(() => {
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      })
      .catch(error => {
        throw error;
      });
  };
};

export function reassignTasksToAnotherGroup(
  taskIdentifiers,
  taskGroupIdentifier,
) {
  return dispatch => {
    return TaskApi.reassignTasksToAnotherGroup(
      taskGroupIdentifier,
      taskIdentifiers,
    )
      .then(() => {
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function reassignTask(taskIdentifier, userId) {
  return dispatch =>
    TaskApi.assignOrReassignTask({ taskIdentifier }, userId)
      .then(() => {
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      })
      .catch(error => {
        throw error;
      });
}

export function getFilteredTasksForList(
  taskListIdentifier,
  status,
  selectedFilters,
  withLoader = true,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch => {
    if (withLoader) {
      dispatch({
        type:
          status === 'INCOMPLETE'
            ? ActionTypes.REQUEST_TASKS
            : ActionTypes.REQUEST_COMPLETED_TASKS,
      });
    }

    return TaskApi.getFilteredTasksForList(
      taskListIdentifier,
      status,
      selectedFilters,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getFilteredTasksForPeopleList(
  userIdentifier,
  status,
  selectedFilters,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.getFilteredTasksForPersonList(
      userIdentifier,
      status,
      selectedFilters,
    )
      .then(tasks => {
        dispatch({ type: action, tasks });
        return tasks;
      })
      .catch(error => {
        throw error;
      });
}

const processTaskCountersSuccess = (data, dispatch) => {
  const payload = {
    incomplete: data
      ? data.find(({ metricName }) => metricName === 'INCOMPLETE_TASKS_COUNT')
          ?.metricValue
      : 0,
    complete: data
      ? data.find(({ metricName }) => metricName === 'COMPLETE_TASKS_COUNT')
          ?.metricValue
      : 0,
  };
  dispatch({ type: ActionTypes.TASK_COUNTERS_SUCCESS, payload });
};

export const getTaskStatsForList = taskListIdentifier => dispatch => {
  return TaskApi.getTaskStatsForList(taskListIdentifier).then(data => {
    processTaskCountersSuccess(data, dispatch);
  });
};

export const getTaskStatsForUser = userIdentifier => dispatch => {
  return TaskApi.getTaskStatsForUser(userIdentifier).then(data => {
    processTaskCountersSuccess(data, dispatch);
  });
};

export const resetTaskCounters = () => ({
  type: ActionTypes.RESET_TASK_COUNTERS,
});

export function markTaskRead(task) {
  return dispatch =>
    TaskApi.flagUnread(task?.taskIdentifier, false)
      .then(() => {
        // do nothing
        dispatch({
          type: ActionTypes.TASK_READ_SUCCESS,
          task,
        });
      })
      .catch(error => {
        throw error;
      });
}
