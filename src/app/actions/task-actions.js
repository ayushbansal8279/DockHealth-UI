/* eslint-disable sonarjs/no-duplicate-string */
import moment from 'moment';
import { curry } from 'ramda';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
// eslint-disable-next-line import/no-cycle
import { getTasksGroupsList } from 'sagas/list-details-saga';
import { openDrawer } from 'actions/task-drawer-actions';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import * as ActionTypes from './action-types';
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

const getListWithGroupsAction = ({ status }) => {
  if (status === 'INCOMPLETE') {
    return ActionTypes.GET_TASKS_BY_GROUPS_SUCCESS;
  }

  return ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS;
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

export function getListTasksGroupedByTaskGroup(
  taskListIdentifier,
  sortBy,
  status,
  startPosition = 0,
  endPosition = 0,
  loadingMore = false,
) {
  const action = getListWithGroupsAction({ status });

  return dispatch => {
    if (loadingMore && status === 'COMPLETE') {
      dispatch({
        type: ActionTypes.GET_MORE_TASKS_REQUEST,
      });
    }

    return TaskApi.getListTasksGroupedByTaskGroup(
      taskListIdentifier,
      status,
      sortBy,
      startPosition,
      endPosition,
    )
      .then(groupedTasks => {
        dispatch({ type: action, groupedTasks, loadingMore });

        const selectedTaskIdentifier = sessionStorage.getItem(
          'selectedTaskIdentifier',
        );

        const allTasks = [];
        groupedTasks.taskGroups.forEach(taskGroup => {
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

export function searchTasks(
  searchTerm,
  sortBy,
  filterBy,
  status,
  startPosition,
  endPosition,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_SUCCESS;

  return dispatch =>
    TaskApi.searchTasks(
      searchTerm,
      status,
      sortBy,
      filterBy,
      startPosition,
      endPosition,
    )
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

export function saveTask(newTask, shouldReloadGroups = false) {
  if (newTask.taskIdentifier) {
    return dispatch =>
      TaskApi.updateTask(newTask)
        .then(task => {
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
            dispatch(
              getTasksGroupsList({
                taskListIdentifier: newTask.taskListIdentifier,
              }),
            );
          }
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

export const moveTask = (
  task,
  taskList,
  taskGroupIdentifier = null,
  parentTaskIdentifier = null,
) => dispatch => {
  const updatedTask = {
    refiled: true,
    ...shapeTask(task),
    taskList,
    taskListIdentifier: taskList.taskListIdentifier,
  };

  if (taskGroupIdentifier) {
    updatedTask.taskGroupIdentifier = taskGroupIdentifier;
  }
  if (parentTaskIdentifier) {
    updatedTask.parentTaskId = null;
    updatedTask.parentTaskIdentifier = parentTaskIdentifier;
  }

  return TaskApi.updateTask(updatedTask)
    .then(() => {
      dispatch({
        type: ActionTypes.MOVE_TASK_SUCCESS,
        task,
        taskList,
      });
      if (parentTaskIdentifier) {
        dispatch(
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          refreshAnotherTask({
            taskIdentifier: task.parentTaskIdentifier,
          }),
        );
        dispatch(
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          refreshAnotherTask({
            taskIdentifier: parentTaskIdentifier,
          }),
        );
      }
      dispatch(
        getTasksGroupsList({
          taskListIdentifier: taskList.taskListIdentifier,
        }),
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
        dispatch(AlertActions.showGlobalAlert(AlertMessages.DELETED));
        dispatch(
          getTasksGroupsList({
            taskListIdentifier: task?.taskList?.taskListIdentifier,
          }),
        );
        return task;
      })
      .catch(error => {
        throw error;
      });
}

export function duplicateTask(task, includeAttachments = false) {
  const taskGroupIdentifier =
    task.taskGroups?.length > 0
      ? task.taskGroups[0].taskGroupIdentifier
      : undefined;
  return dispatch =>
    TaskApi.duplicateTask(task.taskIdentifier, includeAttachments)
      .then(duplicatedTask => {
        dispatch({
          type: ActionTypes.DUPLICATE_TASK_SUCCESS,
          duplicatedTask,
          taskGroupIdentifier,
        });
        dispatch(AlertActions.showGlobalAlert(AlertMessages.TASK_DUPLICATED));
        dispatch(
          getTasksGroupsList({
            taskListIdentifier: task?.taskList?.taskListIdentifier,
          }),
        );
        return duplicatedTask;
      })
      .catch(error => {
        throw error;
      });
}

export function toggleCompleteTask(task, currentUser = null) {
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
      newTaskData.completedDt = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }

    dispatch({
      type: ActionTypes.UPDATE_TASK_SUCCESS,
      task: { ...task, ...newTaskData },
    });

    return TaskApi[apiEndpoint](task)
      .then(() => {
        if (!task.parentTaskIdentifier) {
          setTimeout(
            () => dispatch({ type: ActionTypes.DELETE_TASK_SUCCESS, task }),
            TASK_DISAPPEAR_DELAY,
          );
        }
        dispatch(AlertActions.showGlobalAlert(successMessage));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function markComplete(task, status, currentUser = null) {
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
          type: ActionTypes.UPDATE_TASK_SUCCESS,
          task: { ...task, ...newTaskData },
        });

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
        return newTask;
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
  parentTask,
) => dispatch => {
  const subtaskShape = {
    taskIdentifier: null,
    parentTaskIdentifier,
    parentTask,
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
  sortBy,
  selectedFilters,
  withLoader = true,
) {
  const action =
    status === 'INCOMPLETE'
      ? ActionTypes.GET_TASKS_BY_GROUPS_SUCCESS
      : ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS;

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
      sortBy,
      selectedFilters,
    )
      .then(groupedTasks => {
        dispatch({ type: action, groupedTasks });
        if (groupedTasks.taskFilterOptions) {
          dispatch({
            type: ActionTypes.FETCH_MEGA_FILTERS_UPDATE_SUCCESS,
            filters: groupedTasks.taskFilterOptions,
          });
        }
        return groupedTasks;
      })
      .catch(error => {
        throw error;
      });
  };
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
  assignedTo,
  filters,
  searchValue,
) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_TASKS_SUCCESS,
    tasksToUpdate,
    fields: {
      assignedTo,
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
    type: ActionTypes.UPDATE_TASKS_SUCCESS,
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
    type: ActionTypes.UPDATE_TASKS_SUCCESS,
    tasksToUpdate,
    fields: { dueDate },
    filters,
  });
};

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
      type: ActionTypes.UPDATE_TASKS_SUCCESS,
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
