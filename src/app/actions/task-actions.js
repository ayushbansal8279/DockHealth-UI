import moment from 'moment';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import { getTasksGroupsList } from 'actions/list-details-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import * as ListDetailsApi from 'api/list-details-api';
import { CommunicationType, TaskItemType, transformTaskMetadata } from 'helpers/task-helpers';
import * as ActionTypes from './action-types';
import AlertMessages from '../alert/AlertMessages';

export function storeAsCurrentTask(task) {
  return (dispatch) => {
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

  return (dispatch) => {
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
      .then((groupedTasks) => {
        dispatch({ type: action, groupedTasks, loadingMore });

        const selectedTaskIdentifier = sessionStorage.getItem(
          'selectedTaskIdentifier',
        );

        const allTasks = [];
        for (const taskGroup of groupedTasks) {
          if (taskGroup.tasks) {
            allTasks.push(taskGroup.tasks);
          }
        }
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
          TaskApi.getTaskDetails(selectedTaskIdentifier).then((data) => {
            dispatch(storeAsCurrentTask(data));
            dispatch(openDrawer());
          });
        }

        return groupedTasks;
      })
      .catch((error) => {
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

const shapeTask = (task) => {
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
    return (dispatch) =>
      TaskApi.updateTask(newTask)
        .then(({ task }) => {
          dispatch({
            type: ActionTypes.UPDATE_TASK_SUCCESS,
            task,
          });
          dispatch({ type: ActionTypes.REFRESH_ORIGIN });
          return task;
        })
        .catch((error) => {
          throw error;
        });
  }

  return (dispatch) => {
    if (!newTask.taskIdentifier && !newTask.parentTaskIdentifier) {
      dispatch({
        type: ActionTypes.CHANGE_ADDING_NEW_TASK,
        addingNewTask: true,
      });
    }
    return TaskApi.addTask(newTask)
      .then((task) => {
        if (task.taskList) {
          dispatch({ type: ActionTypes.ADD_TASK_SUCCESS, task });
          dispatch({
            type: ActionTypes.CHANGE_ADDING_NEW_TASK,
            addingNewTask: false,
          });
          if (shouldReloadGroups) {
            dispatch(getTasksGroupsList());
          }
        } else {
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
        }

        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));

        return task;
      })
      .catch((error) => {
        throw error;
      });
  };
}

export function partialUpdateTask(taskIdentifier, dataToUpdate) {
  const transformedDataToUpdate = transformTaskMetadata(dataToUpdate);

  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: {
        ...transformedDataToUpdate,
        taskIdentifier,
      },
    });
    return (
      TaskApi.partialUpdateTask(taskIdentifier, transformedDataToUpdate)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((task) => {
          if (transformedDataToUpdate.details) {
            dispatch({
              type: ActionTypes.UPDATE_TASK_SUCCESS,
              task,
            });
          }
          dispatch({ type: ActionTypes.REFRESH_ORIGIN });
          dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
          return task;
        })
        .catch((error) => {
          throw error;
        })
    );
  };
}

export function updateTaskAssignment(taskIdentifier, dataToUpdate) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: {
        ...dataToUpdate,
        taskIdentifier,
      },
    });
    return (
      TaskApi.updateTaskAssignment(taskIdentifier, dataToUpdate)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((task) => {
          dispatch({ type: ActionTypes.REFRESH_ORIGIN });
          dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
          return task;
        })
        .catch((error) => {
          throw error;
        })
    );
  };
}

export function updateTaskMetaData(taskIdentifier, dataToUpdate) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: {
        ...dataToUpdate,
        taskIdentifier,
      },
    });
    return (
      TaskApi.updateTaskMetaData(taskIdentifier, dataToUpdate)
        // eslint-disable-next-line sonarjs/no-identical-functions
        .then((task) => {
          dispatch({ type: ActionTypes.REFRESH_ORIGIN });
          dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
          return task;
        })
        .catch((error) => {
          throw error;
        })
    );
  };
}

export const moveTask =
  (task, taskList, taskGroupIdentifier = null, parentTaskIdentifier = null) =>
  (dispatch) => {
    const taskToUpdate = {
      refiled: true,
      ...shapeTask(task),
      taskList,
      taskListIdentifier: taskList?.taskListIdentifier,
    };

    if (taskGroupIdentifier) {
      taskToUpdate.taskGroupIdentifier = taskGroupIdentifier;
    }
    if (parentTaskIdentifier) {
      taskToUpdate.parentTaskId = null;
      taskToUpdate.parentTaskIdentifier = parentTaskIdentifier;
    }

    return TaskApi.updateTask(taskToUpdate)
      .then((response) => {
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
        dispatch(getTasksGroupsList());
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
        
      }
    )
      .catch((error) => {
        throw error;
      });
  };

export function addComment(task, taskComment) {
  return (dispatch) =>
    TaskApi.addComment(task?.taskIdentifier, taskComment)
      .then((comment) => {
        dispatch({
          type: ActionTypes.ADD_TASK_COMMENT_SUCCESS,
          task,
          comment,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.COMMENT_ADDED));
        return comment;
      })
      .catch((error) => {
        throw error;
      });
}

export function deleteComment(task, comment) {
  const { commentIdentifier } = comment;
  const { taskIdentifier } = task;

  return (dispatch) =>
    TaskApi.deleteComment(commentIdentifier)
      .then(() => {
        dispatch({
          type: ActionTypes.DELETE_TASK_COMMENT_SUCCESS,
          taskIdentifier,
          commentIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.DELETED));
        return {
          task,
          comment,
        };
      })
      .catch((error) => {
        throw error;
      });
}

export function updateComment(task, comment) {
  return (dispatch) =>
    TaskApi.updateComment(comment)
      .then(({ data }) => {
        dispatch({
          type: ActionTypes.UPDATE_TASK_COMMENT_SUCCESS,
          task,
          comment: data,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
        return {
          task,
          comment,
        };
      })
      .catch((error) => {
        throw error;
      });
}

export function deleteTask(task) {
  return (dispatch) =>
    TaskApi.deleteTask(task.taskIdentifier)
      .then((response) => {
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task.taskIdentifier,
          intent: 'TASK_DELETED',
        });
        dispatch({
          type: ActionTypes.DELETE_SUBTASK,
          subTask: task,
          parentTaskIdentifier: task?.parentTaskIdentifier,
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
      .catch((error) => {
        throw error;
      });
}

export function duplicateTask(task, includeAttachments = false) {
  return (dispatch) =>
    TaskApi.duplicateTask(task.taskIdentifier, includeAttachments)
      .then((duplicatedTask) => {
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
      .catch((error) => {
        throw error;
      });
}

export function toggleCompleteTask(
  taskObject,
  currentUser = null,
  isBundleTask = false,
) {
  const { templateBundleIdentifier, ...task } = taskObject;
  return (dispatch) => {
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

    // eslint-disable-next-line import/namespace
    return TaskApi[apiEndpoint](task)
      .then(() => {
        if (
          (!task.parentTaskIdentifier || task.parentTaskIdentifier) &&
          !isBundleTask &&
          newStatus === 'COMPLETE'
        ) {
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
      .catch((error) => {
        throw error;
      });
  };
}

export function makeTaskDisappear(taskObject) {
  const { ...task } = taskObject;
  return (dispatch) => {
    setTimeout(
      // eslint-disable-next-line sonarjs/no-identical-functions
      () =>
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task.taskIdentifier,
        }),
      TASK_DISAPPEAR_DELAY,
    );
  };
}

export function updateTaskDescription(task, descriptionState) {
  return {
    type: ActionTypes.UPDATE_TASK_DESCRIPTION,
    task,
    descriptionState,
  };
}

export function updateCustomFieldsByTaskIdentifiers({
  taskIdentifiers,
  taskWorkflowIdentifiers,
  metaData,
}) {
  return {
    type: ActionTypes.UPDATE_CUSTOM_FIELDS_BY_TASK_IDENTIFIERS,
    payload: {
      taskIdentifiers,
      taskWorkflowIdentifiers,
      metaData,
    },
  };
}

export function updateTaskDetails(task, detailsState) {
  return {
    type: ActionTypes.UPDATE_TASK_DETAILS,
    task,
    detailsState,
  };
}

export function updateTaskStartDate(task, startDate, startDateIntent = null) {
  return {
    type: ActionTypes.UPDATE_TASK_START_DATE,
    task,
    startDate,
    ...(startDateIntent && {startDateIntent})
  };
}

export function updateTaskDueDate(task, dueDate, dueDateIntent=null) {
  return {
    type: ActionTypes.UPDATE_TASK_DUE_DATE,
    task,
    dueDate,
    ...(dueDateIntent && {dueDateIntent})
  };
}

export const updatePatient = (task, patient) => (dispatch) =>
  TaskApi.updateTask(shapeTask({ ...task, patient }))
    .then(({ task: updatedTask }) => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: updatedTask,
      });
      dispatch({ type: ActionTypes.REFRESH_ORIGIN });
      return updatedTask;
    })
    .catch((error) => {
      throw error;
    });

export const updateReminder = (task, reminderDt) => (dispatch) =>
  TaskApi.updateTask(shapeTask({ ...task, reminderDt }))
    .then(() => {
      const newTask = task;
      newTask.reminderDt = reminderDt;
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task: newTask,
      });
      dispatch({ type: ActionTypes.REFRESH_ORIGIN });
    })
    .catch((error) => {
      throw error;
    });

export const updateWorkflowStatus = (task, workflowStatus) => (dispatch) => {
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
    .then((modifiedTask) => {
      dispatch({ type: ActionTypes.REFRESH_ORIGIN });
      dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      return modifiedTask;
    })
    .catch((error) => {
      dispatch({
        type: ActionTypes.UPDATE_TASK_SUCCESS,
        task,
      });
      dispatch({ type: ActionTypes.REFRESH_ORIGIN });
      throw error;
    });
};

export function getTaskHistory(task) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.REQUEST_HISTORY });

    return TaskApi.getTaskHistory(task.taskIdentifier)
      .then((auditDetails) => {
        dispatch({ type: ActionTypes.GET_TASK_HISTORY_SUCCESS, auditDetails });
        return auditDetails;
      })
      .catch((error) => {
        dispatch({ type: ActionTypes.GET_TASK_HISTORY_ERROR, error });
        throw error;
      });
  };
}

export const addTaskAttachment =
  (taskIdentifier, fileData, additionalConfig) => (dispatch) =>
    TaskApi.addTaskAttachment(taskIdentifier, fileData, additionalConfig)
      .then((response) => {
        dispatch({
          type: ActionTypes.TASK_ATTACHMENT_ADDED,
          taskIdentifier,
          taskAttachment: response.data,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.ATTACHMENT_ADDED));

        return response.data;
      })
      .catch((error) => {
        throw error;
      });

export const removeTaskAttachment =
  (taskIdentifier, taskAttachmentId) => (dispatch) =>
    TaskApi.removeTaskAttachment(taskAttachmentId)
      .then(() => {
        dispatch({
          type: ActionTypes.TASK_ATTACHMENT_REMOVED,
          taskIdentifier,
          taskAttachmentId,
        });
        dispatch(
          AlertActions.showGlobalAlert(AlertMessages.ATTACHMENT_REMOVED),
        );
      })
      .catch((error) => {
        throw error;
      });

export const renameTaskAttachment =
  (taskIdentifier, attachmentIdentifier ,fileName ) => (dispatch) => {
    return TaskApi.updateTaskAttachment(attachmentIdentifier,fileName)
      .then(() => {
        dispatch({
          type: ActionTypes.UPDATE_TASK_ATTACHMENT,
          taskIdentifier,
          attachmentIdentifier,
          fileName,
        });
        dispatch(
          AlertActions.showGlobalAlert(AlertMessages.UPDATED),
        );
      })
      .catch((error) => {
        throw error;
      });
  };

export const addPatientReferenceAttachment =
  (taskIdentifier, attachmentIdentifier, type ) => (dispatch) => {
    return TaskApi.addPatientReferenceAttachment(taskIdentifier, attachmentIdentifier, type)
      .then((response) => {
        dispatch({
          type: ActionTypes.PATIENT_REFERENCE_ATTACHMENT_ADDED,
          taskIdentifier,
          taskAttachment: response.data,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.ATTACHMENT_ADDED));
        return response.data;
      })
      .catch((error) => {
        throw error;
      });
  };  
  
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

export const refreshAndOpenAsCurrentTask =
  (selectedTask, shouldOpenDrawer = true) =>
  (dispatch) =>
    TaskApi.getTaskDetails(selectedTask.taskIdentifier)
      .then((task) => {
        // explicitly mark task as updated so we can show the flag
        task.updated = true; // eslint-disable-line no-param-reassign
        dispatch({
          type: ActionTypes.SET_AS_CURRENT_TASK,
          task,
        });
        if (shouldOpenDrawer) dispatch(openDrawer());
        return task;
      })
      .catch((error) => {
        dispatch({
          type: ActionTypes.SET_AS_CURRENT_TASK_ERROR,
        });
        throw error;
      });

export function reassignTask(taskIdentifier, userId) {
  return (dispatch) =>
    TaskApi.assignOrReassignTask({ taskIdentifier }, userId)
      .then(() => {
        dispatch(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
      })
      .catch((error) => {
        throw error;
      });
}

export const loadSubTasks = (task) => (dispatch) => {
  dispatch({
    type: ActionTypes.REQUEST_LOAD_SUBTASKS,
    task,
  });

  return TaskApi.getTaskDetails(task?.taskIdentifier)
    .then((loadedtask) => {
      // explicitly mark task as updated so we can show the flag
      loadedtask.updated = true; // eslint-disable-line no-param-reassign
      dispatch({
        type: ActionTypes.LOAD_SUBTASKS_SUCCESS,
        task: loadedtask,
      });
      return loadedtask;
    })
    .catch((error) => {
      throw error;
    });
};

export const openQuickAddSubtask = (taskIdentifier) => ({
  type: ActionTypes.OPEN_QUICK_ADD_SUBTASK_INPUT,
  taskIdentifier,
});

export const closeQuickAddSubtask = (taskIdentifier) => ({
  type: ActionTypes.CLOSE_QUICK_ADD_SUBTASK_INPUT,
  taskIdentifier,
});

export const bulkEditAssignUsers = (tasksToUpdate, users) => (dispatch) => {
  dispatch({
    type: ActionTypes.DO_ASSIGNMENT,
    tasksToUpdate,
    users,
  });
};

export const bulkEditUnassignUsers = (tasksToUpdate, users) => (dispatch) => {
  dispatch({
    type: ActionTypes.DO_UNASSIGNMENT,
    tasksToUpdate,
    users,
  });
};

export const bulkEditTasks = (payload, callback) => (dispatch) => {
  dispatch({
    type: ActionTypes.BULK_EDIT_TASKS,
    payload,
    callback,
  });
};

export const bulkEditUnassignAllUsers = (tasksToUpdate) => (dispatch) => {
  dispatch({
    type: ActionTypes.DO_UNASSIGN_ALL,
    tasksToUpdate,
  });
};

export const bulkEditWorkflowStatus =
  (tasksToUpdate, workflowStatus) => (dispatch) => {
    dispatch({
      type: ActionTypes.UPDATE_TASKS,
      tasksToUpdate,
      fields: { workflowStatus },
    });
  };

export const bulkEditDueDate = (tasksToUpdate, dueDate) => (dispatch) => {
  dispatch({
    type: ActionTypes.UPDATE_TASKS,
    tasksToUpdate,
    fields: { dueDate },
  });
};

export function bulkEditDueDateSuccess(tasksToUpdate, dueDate) {
  return {
    type: ActionTypes.UPDATE_TASKS_SUCCESS,
    tasksToUpdate,
    fields: { dueDate },
  };
}

export const bulkEditDelete = (tasksToDelete) => (dispatch) => {
  dispatch({
    type: ActionTypes.DELETE_TASKS_SUCCESS,
    tasksToDelete,
  });
};

export function bulkEditComplete(taskToComplete, currentUser = null) {
  return (dispatch) => {
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

    setTimeout(() => {
      for (const task of taskToComplete) {
        dispatch({
          type: ActionTypes.DELETE_TASK,
          taskIdentifier: task,
        });
      }
    }, 1500);
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

function getTasksMap(state) {
  if (Object.keys(state.listDetails?.tasksMap)?.length > 0) {
    return state.listDetails?.tasksMap;
  }
  if (Object.keys(state.dashboardTasks?.tasksMap)?.length > 0) {
    return state.dashboardTasks?.tasksMap;
  }
  if (Object.keys(state.globalSearch?.tasksMap)?.length > 0) {
    return state.globalSearch?.tasksMap;
  }
  if (Object.keys(state.patientDetails?.tasksMap)?.length > 0) {
    return state.patientDetails?.tasksMap;
  }
  if (Object.keys(state.personDetails?.tasksMap)?.length > 0) {
    return state.personDetails?.tasksMap;
  }
  if (Object.keys(state.taskTemplate?.tasksMap)?.length > 0) {
    return state.taskTemplate?.tasksMap;
  }
}

function selectChildTaskItems(task) {
  const childTaskIdentifiers = [];
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (task?.itemType === TaskItemType.TASK) {
    // check for subtasks
    // eslint-disable-next-line unicorn/no-lonely-if
    if (task.subtasks?.length > 0) {
      childTaskIdentifiers.concat(task.subtasks?.map((st) => st.identifier));
    }
  }
  return childTaskIdentifiers;
}

export function selectTask(taskIdentifier, newSelectState) {
  return (dispatch, getState) => {
    const tasksMap = getTasksMap(getState());
    let selectedTaskIdentifiers = [taskIdentifier];

    const task = tasksMap[taskIdentifier];
    const childTaskIdentifiers = selectChildTaskItems(task);
    selectedTaskIdentifiers =
      selectedTaskIdentifiers.concat(childTaskIdentifiers);

    dispatch({
      type: ActionTypes.CHANGE_TASKS_SELECTED_STATE,
      taskIdentifiers: selectedTaskIdentifiers,
      isSelected: newSelectState,
    });
  };
}

export function unselectAllTasks() {
  return {
    type: ActionTypes.TASK_ITEM_UNSELECT_ALL,
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

export function changeTasksSelectedState(isSelected, taskIdentifiers) {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  return (dispatch, getState) => {
    const tasksMap = getTasksMap(getState());
    let selectedTaskIdentifiers = taskIdentifiers;

    for (const taskId of taskIdentifiers) {
      const task = tasksMap[taskId];
      const childTaskIdentifiers = selectChildTaskItems(task);
      selectedTaskIdentifiers =
        selectedTaskIdentifiers.concat(childTaskIdentifiers);
    }

    dispatch({
      type: ActionTypes.CHANGE_TASKS_SELECTED_STATE,
      isSelected,
      taskIdentifiers: selectedTaskIdentifiers,
    });
  };
}

export function addSubtask(parentTaskIdentifier, subtask) {
  return function addSubtaskDispatch(dispatch) {
    return TaskApi.addTask({ ...subtask, parentTaskIdentifier })
      .then((newSubtask) => {
        dispatch({
          type: ActionTypes.ADD_SUBTASK,
          subtask: newSubtask,
          parentTaskIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
        return newSubtask;
      })
      .catch((error) => {
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

export function sendEmrForTask(emrData) {
  return {
    type: ActionTypes.SEND_EMR_FOR_TASK,
    emrData,
  };
}

export function markTaskAsRead(taskIdentifier) {
  return {
    type: ActionTypes.MARK_TASK_AS_READ,
    taskIdentifier,
  };
}

export function markTaskAsUnRead(taskIdentifier) {
  return {
    type: ActionTypes.MARK_TASK_AS_UNREAD,
    taskIdentifier,
  };
}

export function deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier) {
  if(sourceTaskIdentifier === 'START_INDICATOR') {
    sourceTaskIdentifier = targetTaskIdentifier
  }
  if(targetTaskIdentifier === 'END_INDICATOR') {
    targetTaskIdentifier = sourceTaskIdentifier
  }
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

export function sendESignForTask(communicationDetails) {
  return {
    type: ActionTypes.SEND_ESIGN_FOR_TASK,
    communicationDetails: {
      ...communicationDetails,
      communicationType: CommunicationType.ESIGN,
    },
  };
}

export function sendSmsForTask(communicationDetails) {
  return {
    type: ActionTypes.SEND_SMS_FOR_TASK,
    communicationDetails: {
      ...communicationDetails,
      communicationType: CommunicationType.SMS,
    },
  };
}

export function sendSecureMessageForTask(communicationDetails) {
  return {
    type: ActionTypes.SEND_SECURE_MSG_FOR_TASK,
    communicationDetails: {
      ...communicationDetails,
      communicationType: CommunicationType.SECURE_MESSAGE,
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
export function getTasksForProfile(profileIdentifier) {
  return {
    type: ActionTypes.GET_CURRENT_PROFILE_TASKS,
    profileIdentifier,
  };
}

export function shareTask(
  taskIdentifier,
  userIdentifiers,
  externalUsers,
  message,
  assignTask,
) {
  return {
    type: ActionTypes.SHARE_TASK,
    taskIdentifier,
    userIdentifiers,
    externalUsers,
    message,
    assignTask,
  };
}
