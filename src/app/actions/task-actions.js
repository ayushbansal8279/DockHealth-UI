import moment from 'moment';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import { getTasksGroupsList } from 'actions/list-details-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import * as ListDetailsApi from 'api/list-details-api';
import { CommunicationType } from 'helpers/task-helpers';
import * as ActionTypes from './action-types';
import AlertMessages from '../alert/AlertMessages';

export function storeAsCurrentTask(task) {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_AS_CURRENT_TASK, task });
  };
}

const getListWithGroupsAction = ({ status }) => {
  if (status === 'INCOMPLETE') {
    return ActionTypes.GET_TASKS_BY_GROUPS_SUCCESS;
  }

  return ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS;
};

export function getListTasksGroupedByTaskGroup(
  taskListIdentifier,
  sortBy,
  status,
  startPosition = 0,
  endPosition = 0,
  loadingMore = false,
  viewMode,
) {
  const action = getListWithGroupsAction({ status });

  return dispatch => {
    if (loadingMore && status === 'COMPLETE') {
      dispatch({
        type: ActionTypes.GET_MORE_TASKS_REQUEST,
      });
    }

    return ListDetailsApi.getListTasksGroupedByTaskGroup(
      taskListIdentifier,
      status,
      sortBy,
      startPosition,
      endPosition,
      viewMode,
    )
      .then(groupedTasks => {
        dispatch({ type: action, groupedTasks, loadingMore });

        const selectedTaskIdentifier = sessionStorage.getItem(
          'selectedTaskIdentifier',
        );

        const allTasks = [];
        groupedTasks.forEach(taskGroup => {
          if (taskGroup.tasks) {
            allTasks.push(taskGroup.tasks);
          }
        });
        const selectedTask = allTasks
          .reduce((allTasksArray, tasksArray) => [
            ...allTasksArray,
            ...tasksArray,
          ])
          .find(
            ({ taskIdentifier }) => taskIdentifier === selectedTaskIdentifier,
          );

        if (selectedTask) {
          dispatch(storeAsCurrentTask(selectedTask));
          dispatch(openDrawer());
          sessionStorage.removeItem('selectedTaskIdentifier');
        } else if (selectedTaskIdentifier) {
          TaskApi.getTaskDetails(selectedTaskIdentifier).then(data => {
            dispatch(storeAsCurrentTask(data));
            dispatch(openDrawer());
          });
        }

        return groupedTasks;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function refreshTaskBundle(templateBundleIdentifier) {
  return {
    type: ActionTypes.REFRESH_TASK_BUNDLE,
    templateBundleIdentifier,
  };
}

export const chooseTaskDecisionOutcome = (
  taskOutcomeIdentifier,
  task,
  templateBundleIdentifier,
) => ({
  type: ActionTypes.CHOOSE_DECISION_TASK_OPTION,
  payload: { taskOutcomeIdentifier, task, templateBundleIdentifier },
});

const shapeTask = task => {
  const { assignedTo, patient } = task;

  return {
    ...task,
    assignedToIdentifier: assignedTo ? assignedTo.userIdentifier : null,
    patientIdentifier: patient ? patient.patientIdentifier : null,
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export function saveTask(newTask, shouldReloadGroups = false) {
  if (newTask.taskIdentifier) {
    return dispatch =>
      TaskApi.updateTask(newTask)
        .then(({ task }) => {
          dispatch({
            type: ActionTypes.UPDATE_TASK_SUCCESS,
            task,
          });
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
        } else {
          dispatch({ type: ActionTypes.ADD_TASK_SUCCESS, task });
          dispatch({
            type: ActionTypes.CHANGE_ADDING_NEW_TASK,
            addingNewTask: false,
          });
          if (shouldReloadGroups) {
            dispatch(getTasksGroupsList());
          }
        }

        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));

        return task;
      })
      .catch(error => {
        throw error;
      });
  };
}

export function partialUpdateTask(taskIdentifier, dataToUpdate) {
  return dispatch => {
    dispatch({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: {
        ...dataToUpdate,
        taskIdentifier,
      },
    });
    return (
      TaskApi.partialUpdateTask(taskIdentifier, dataToUpdate)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then(task => {
          dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
          return task;
        })
        .catch(error => {
          throw error;
        })
    );
  };
}

export const moveTask = (
  task,
  taskList,
  taskGroupIdentifier = null,
  parentTaskIdentifier = null,
) => dispatch => {
  const taskToUpdate = {
    refiled: true,
    ...shapeTask(task),
    taskList,
    taskListIdentifier: taskList.taskListIdentifier,
  };

  if (taskGroupIdentifier) {
    taskToUpdate.taskGroupIdentifier = taskGroupIdentifier;
  }
  if (parentTaskIdentifier) {
    taskToUpdate.parentTaskId = null;
    taskToUpdate.parentTaskIdentifier = parentTaskIdentifier;
  }

  return TaskApi.updateTask(taskToUpdate)
    .then(response => {
      const updatedTask = response.data;

      dispatch({
        type: ActionTypes.DELETE_TASK,
        taskIdentifier: updatedTask.taskIdentifier,
      });
      if (updatedTask.parentTaskIdentifier) {
        dispatch({
          type: ActionTypes.ADD_SUBTASK,
          subtask: updatedTask,
        });
      } else {
        dispatch({
          type: ActionTypes.ADD_TASK_SUCCESS,
          task: updatedTask,
        });
      }

      dispatch(
        AlertActions.showGlobalAlertWithUndo(
          AlertMessages.TASK_MOVED,
          response?.headers?.['x-transaction-id'],
          () => {
            dispatch({
              type: ActionTypes.DELETE_TASK,
              taskIdentifier: task.taskIdentifier,
            });
            if (task.parentTaskIdentifier) {
              dispatch({
                type: ActionTypes.ADD_SUBTASK,
                subtask: task,
              });
            } else {
              dispatch({
                type: ActionTypes.ADD_TASK_SUCCESS,
                task,
              });
            }
          },
        ),
      );
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
  const { commentIdentifier } = comment;
  const { taskIdentifier } = task;

  return dispatch =>
    TaskApi.deleteComment(commentIdentifier)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_TASK_COMMENT_SUCCESS,
          taskIdentifier,
          commentIdentifier,
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
      .then(response => {
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task.taskIdentifier,
        });
        dispatch(
          AlertActions.showGlobalAlertWithUndo(
            AlertMessages.DELETED,
            response?.headers?.['x-transaction-id'],
            () => {
              dispatch({
                type: ActionTypes.ADD_TASK_SUCCESS,
                task,
              });
            },
          ),
        );
        dispatch(getTasksGroupsList());
        return task;
      })
      .catch(error => {
        throw error;
      });
}

export function duplicateTask(task, includeAttachments = false) {
  return dispatch =>
    TaskApi.duplicateTask(task.taskIdentifier, includeAttachments)
      .then(duplicatedTask => {
        if (duplicatedTask.parentTaskIdentifier) {
          dispatch({
            type: ActionTypes.ADD_SUBTASK,
            subtask: duplicatedTask,
          });
        } else {
          dispatch({
            type: ActionTypes.ADD_TASK_SUCCESS,
            task: duplicatedTask,
          });
        }
        dispatch(getTasksGroupsList());
        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_DUPLICATED));

        return duplicatedTask;
      })
      .catch(error => {
        throw error;
      });
}

export function toggleCompleteTask(
  taskObject,
  currentUser = null,
  isBundleTask = false,
) {
  const { templateBundleIdentifier, ...task } = taskObject;
  return dispatch => {
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
    };

    if (newStatus === 'COMPLETE') {
      newTaskData.completedBy = currentUser;
      newTaskData.completedDt = moment().toISOString();
    }
    dispatch({
      type: ActionTypes.SET_COMPLETE_STATUS,
      taskIdentifier: task.taskIdentifier,
      dataToUpdate: newTaskData,
    });

    return TaskApi[apiEndpoint](task)
      .then(() => {
        if (!task.parentTaskIdentifier && !isBundleTask) {
          setTimeout(
            () =>
              dispatch({
                type: ActionTypes.DELETE_TASK,
                taskIdentifier: task.taskIdentifier,
              }),
            TASK_DISAPPEAR_DELAY,
          );
        }

        if (templateBundleIdentifier) {
          dispatch(refreshTaskBundle(templateBundleIdentifier));
        }
        dispatch(AlertActions.showGlobalAlert(successMessage));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function updateTaskDescription(task, descriptionState) {
  return {
    type: ActionTypes.UPDATE_TASK_DESCRIPTION,
    task,
    descriptionState,
  };
}

export function updateTaskDetails(task, detailsState) {
  return {
    type: ActionTypes.UPDATE_TASK_DETAILS,
    task,
    detailsState,
  };
}

export function updateTaskDueDate(task, dueDate) {
  return {
    type: ActionTypes.UPDATE_TASK_DUE_DATE,
    task,
    dueDate,
  };
}

export const updatePatient = (task, patient) => dispatch =>
  TaskApi.updateTask(shapeTask({ ...task, patient }))
    .then(({ task: updatedTask }) => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: updatedTask,
      });
      return updatedTask;
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

  const updatedTask = {
    ...task,
    workflowStatus,
  };
  dispatch({
    type: ActionTypes.UPDATE_TASK_SUCCESS,
    task: updatedTask,
  });

  return TaskApi.updateWorkflowStatus(
    taskIdentifier,
    workflowStatus?.identifier || null,
  )
    .then(modifiedTask => {
      dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      return modifiedTask;
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task,
      });
      throw error;
    });
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

export function refreshTask(taskIdentifier) {
  return {
    type: ActionTypes.REFRESH_TASK,
    taskIdentifier,
  };
}

export function insertCreatedTask(taskIdentifier) {
  return {
    type: ActionTypes.INSERT_CREATED_TASK,
    taskIdentifier,
  };
}

export const refreshAndOpenAsCurrentTask = (
  selectedTask,
  shouldOpenDrawer = true,
) => dispatch => {
  return TaskApi.getTaskDetails(selectedTask.taskIdentifier)
    .then(task => {
      // explicitly mark task as updated so we can show the flag
      task.updated = true; // eslint-disable-line no-param-reassign
      dispatch({
        type: ActionTypes.SET_AS_CURRENT_TASK,
        task,
      });
      if (shouldOpenDrawer) dispatch(openDrawer());
      return task;
    })
    .catch(error => {
      dispatch({
        type: ActionTypes.SET_AS_CURRENT_TASK_ERROR,
      });
      throw error;
    });
};

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

export const loadSubTasks = task => dispatch => {
  dispatch({
    type: ActionTypes.REQUEST_LOAD_SUBTASKS,
    task,
  });

  return TaskApi.getTaskDetails(task?.taskIdentifier)
    .then(loadedtask => {
      // explicitly mark task as updated so we can show the flag
      loadedtask.updated = true; // eslint-disable-line no-param-reassign
      dispatch({
        type: ActionTypes.LOAD_SUBTASKS_SUCCESS,
        task: loadedtask,
      });
      return loadedtask;
    })
    .catch(error => {
      throw error;
    });
};

export const openQuickAddSubtask = taskIdentifier => ({
  type: ActionTypes.OPEN_QUICK_ADD_SUBTASK_INPUT,
  taskIdentifier,
});

export const closeQuickAddSubtask = taskIdentifier => ({
  type: ActionTypes.CLOSE_QUICK_ADD_SUBTASK_INPUT,
  taskIdentifier,
});

export const bulkEditAssignUser = (
  tasksToUpdate,
  assignedToUsers,
  filters,
  searchValue,
) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_TASKS,
    tasksToUpdate,
    fields: {
      assignedToUsers,
    },
    filters,
    searchValue,
  });
};

export const bulkEditWorkflowStatus = (
  tasksToUpdate,
  workflowStatus,
  filters,
  searchValue,
) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_TASKS,
    tasksToUpdate,
    fields: { workflowStatus },
    filters,
    searchValue,
  });
};

export const bulkEditDueDate = (
  tasksToUpdate,
  dueDate,
  filters,
) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_TASKS,
    tasksToUpdate,
    fields: { dueDate },
    filters,
  });
};

export function bulkEditDueDateSuccess(tasksToUpdate, dueDate) {
  return {
    type: ActionTypes.UPDATE_TASKS_SUCCESS,
    tasksToUpdate,
    fields: { dueDate },
  };
}

export const bulkEditDelete = tasksToDelete => dispatch => {
  dispatch({
    type: ActionTypes.DELETE_TASKS_SUCCESS,
    tasksToDelete,
  });
};

export function bulkEditComplete(taskToComplete, currentUser = null) {
  return dispatch => {
    const newTaskData = {
      status: 'COMPLETE',
      completedBy: currentUser,
      completedDt: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };

    dispatch({
      type: ActionTypes.UPDATE_TASKS,
      tasksToUpdate: taskToComplete,
      fields: newTaskData,
    });

    setTimeout(
      () =>
        dispatch({
          type: ActionTypes.COMPLETE_TASKS_SUCCESS,
          tasksToDelete: taskToComplete,
        }),
      1500,
    );
  };
}

export function reorderSubtasks({ parentTask, source, destination }) {
  return {
    type: ActionTypes.REORDER_SUBTASKS,
    parentTask,
    source,
    destination,
  };
}

export function selectTask(taskIdentifier, newSelectState) {
  return {
    type: ActionTypes.UPDATE_TASK_SUCCESS,
    task: {
      taskIdentifier,
      selected: newSelectState,
    },
  };
}

export function setRecurringScheduleFlag(taskIdentifier, hasRecurringSchedule) {
  return {
    type: ActionTypes.UPDATE_TASK_SUCCESS,
    task: {
      taskIdentifier,
      hasRecurringSchedule,
    },
  };
}

export function unselectAllTasks() {
  return {
    type: ActionTypes.UNSELECT_ALL_TASKS,
  };
}

export function changeTasksSelectedState(newSelectedState, taskIdentifiers) {
  return {
    type: ActionTypes.CHANGE_TASKS_SELECTED_STATE,
    newSelectedState,
    taskIdentifiers,
  };
}

export function addSubtask(parentTaskIdentifier, subtask) {
  return function addSubtaskDispatch(dispatch) {
    return TaskApi.addTask({ ...subtask, parentTaskIdentifier })
      .then(newSubtask => {
        dispatch({
          type: ActionTypes.ADD_SUBTASK,
          subtask: newSubtask,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
        return newSubtask;
      })
      .catch(error => {
        dispatch(AlertActions.showGlobalErrorAlert());
        throw error;
      });
  };
}

export function updateWorkflowStatusForTasks(statusIdentifier, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_STATUS_FOR_TASKS,
    statusIdentifier,
    dataToUpdate,
  };
}

export function addTaskDependencyLink(sourceTask, targetTaskIdentifier) {
  return {
    type: ActionTypes.ADD_TASK_DEPENDENCY_LINK,
    sourceTask,
    targetTaskIdentifier,
  };
}

export function updateTasksLink(link) {
  return {
    type: ActionTypes.UPDATE_TASKS_LINK,
    link,
  };
}

export function sendEmailForTask(communicationDetails) {
  return {
    type: ActionTypes.SEND_EMAIL_FOR_TASK,
    communicationDetails: {
      ...communicationDetails,
      communicationType: CommunicationType.EMAIL,
    },
  };
}

export function deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier) {
  return {
    type: ActionTypes.DELETE_TASKS_LINK,
    sourceTaskIdentifier,
    targetTaskIdentifier,
  };
}

export function sendFaxForTask(communicationDetails) {
  return {
    type: ActionTypes.SEND_FAX_FOR_TASK,
    communicationDetails: {
      ...communicationDetails,
      communicationType: CommunicationType.FAX,
    },
  };
}

export function changeTaskIntentType(taskIdentifier, intentType) {
  return {
    type: ActionTypes.CHANGE_TASK_INTENT_TYPE,
    taskIdentifier,
    intentType,
  };
}

export function addTask(task) {
  return {
    type: ActionTypes.ADD_TASK,
    task,
  };
}

export function changeTaskPriority(task, priority) {
  return {
    type: ActionTypes.CHANGE_TASK_PRIORITY,
    task,
    priority,
  };
}

export function bulkEditDuplicateTasksSuccess(duplicatedTasks) {
  return {
    type: ActionTypes.BULK_EDIT_DUPLICATE_TASKS_SUCCESS,
    duplicatedTasks,
  };
}
