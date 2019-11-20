import {
  always,
  evolve,
  ifElse,
  map,
  mergeDeepLeft,
  propEq,
  uncurryN,
  unless,
  when,
} from 'ramda';

import {
  ADD_PATIENT_TO_TASK_SUCCESS,
  ADD_TASK_COMMENT_SUCCESS,
  ADD_TASK_SUCCESS,
  ASSIGN_OR_REASSIGN_TASK_SUCCESS,
  CHANGE_ADDING_NEW_SUBTASK,
  CHANGE_ADDING_NEW_TASK,
  CLEAR_CURRENT_TASK_HISTORY,
  DELETE_TASK_COMMENT_SUCCESS,
  DELETE_TASK_SUCCESS,
  DUPLICATE_TASK_SUCCESS,
  EDIT_TASK,
  FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS,
  GET_TASK_HISTORY_ERROR,
  GET_TASK_HISTORY_SUCCESS,
  GET_TASKS_SUCCESS,
  HIDE_COMPLETED_TASKS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  MARK_TASK_STATUS_SUCCESS,
  MOVE_TASK_SUCCESS,
  MOVE_TASK_BETWEEN_LISTS,
  ORDER_SUB_TASK_SUCCESS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_HISTORY,
  REQUEST_TASKS,
  SET_AS_CURRENT_TASK,
  TASK_ATTACHMENT_ADDED,
  TASK_ATTACHMENT_REMOVED,
  TOGGLE_TASK_PRIORITY_SUCCESS,
  UPDATE_TASK_COMMENT_SUCCESS,
  UPDATE_TASK_DESCRIPTION_SUCCESS,
  UPDATE_TASK_DUE_DATE,
  UPDATE_TASK_PATIENT,
  UPDATE_TASK_REMINDER,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_WORKFLOW_STATUS,
  TASK_ARCHIVED,
} from '../actions/action-types';

const initialState = {
  completedTasks: [],
  tasks: [],
  task: {},
  isFetching: false,
  isCompletedTasksFetching: false,
  isHistoryFetching: false,
  historyError: null,
  showingCompletedTasks: false,
  currentTaskHistory: null,
  selectedTask: null,
  selectedTaskId: null,
  addingNewSubtask: false,
  addingNewSubtaskParentId: null,
  subtaskShape: {},
  addingNewTask: false,
};

const getMainTaskId = ({ parentTaskId, taskId }) => parentTaskId || taskId;

const updateTaskOrSubtask = (tasks, taskId, update) => {
  const updatedTasks = tasks.map(t =>
    t.taskId === taskId
      ? update(t)
      : {
          ...t,
          subtasks: t.subtasks.map(st =>
            st.taskId === taskId ? update(st) : st,
          ),
        },
  );

  return updatedTasks;
};

const requestHistory = state => ({ ...state, isHistoryFetching: true });

const requestHistorySuccess = (state, { auditDetails }) => ({
  ...state,
  historyError: null,
  isHistoryFetching: false,
  currentTaskHistory: auditDetails,
});

const requestHistoryError = (state, { error }) => ({
  ...state,
  historyError: error,
  isHistoryFetching: false,
});

const clearHistory = state => ({ ...state, currentTaskHistory: null });

const updateDueDate = (state, { taskId, dueDate }) => {
  const updateStatus = t => ({ ...t, dueDate });
  const updatedTasks = updateTaskOrSubtask(state.tasks, taskId, updateStatus);
  return { ...state, tasks: updatedTasks };
};

const updateWorkflowStatus = (state, { taskId, workflowStatus }) => {
  const updateStatus = t => ({ ...t, workflowStatus });
  const updatedTasks = updateTaskOrSubtask(state.tasks, taskId, updateStatus);
  return { ...state, tasks: updatedTasks };
};

const updatePatient = (state, { parentTaskId, patient }) => ({
  ...state,
  tasks: state.tasks.map(task =>
    task.taskId === parentTaskId
      ? {
          ...task,
          patient,
          subtasks: task.subtasks.map(subtask => ({ ...subtask, patient })),
        }
      : task,
  ),
});

const updateReminder = (state, { taskId, reminderDt }) => {
  const updateStatus = t => ({ ...t, reminderDt });
  const updatedTasks = updateTaskOrSubtask(state.tasks, taskId, updateStatus);
  return { ...state, tasks: updatedTasks };
};

const TASK_COMPLETE = 'COMPLETE';

const updateMainTask = taskData =>
  evolve({
    ...map(always, taskData),
    subtasks: map(
      unless(propEq('status', TASK_COMPLETE), mergeDeepLeft(taskData)),
    ),
  });

const updateSubTask = (taskData, subtask) =>
  evolve({
    subtasks: map(
      when(propEq('taskId', subtask.taskId), mergeDeepLeft(taskData)),
    ),
  });

const updateTask = uncurryN(3, taskData => task =>
  map(
    when(
      propEq('taskId', task.parentTaskId || task.taskId),
      ifElse(
        propEq('taskId', task.taskId),
        updateMainTask(taskData),
        unless(propEq('status', TASK_COMPLETE), updateSubTask(taskData, task)),
      ),
    ),
  ),
);

const isSubtask = ({ parentTaskId }) => parentTaskId !== null;
const isParentOfAddedTask = addedTask => ({ taskId }) =>
  taskId === addedTask.parentTaskId;

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const parentTask = state.tasks.find(({ taskId }) =>
        isParentOfAddedTask(addedTask)({ taskId }),
      );

      if (isSubtask(addedTask)) {
        addedTask.patient = parentTask?.patient;
      }

      const tasks = isSubtask(addedTask)
        ? state.tasks.map(task =>
            isParentOfAddedTask(addedTask)(task)
              ? { ...task, subtasks: task.subtasks.concat([addedTask]) }
              : task,
          )
        : [addedTask].concat(state.tasks);

      return { ...state, tasks };
    }

    case DUPLICATE_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return {
        ...state,
        tasks: state.tasks.concat([action.duplicatedTask]),
      };

    case GET_TASKS_SUCCESS: {
      // isFetching is used for the loading image
      let { tasks } = action;

      tasks = tasks.map(task => ({
        ...task,
        subtasks: task.subtasks?.map(subtask => ({
          ...subtask,
          patient: task.patient,
        })),
      }));

      return { ...state, tasks, isFetching: false };
    }

    case GET_COMPLETED_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(task => ({
        ...task,
        subtasks: task.subtasks?.map(subtask => ({
          ...subtask,
          patient: task.patient,
        })),
      }));

      return {
        ...state,
        completedTasks: tasks,
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
      };
    }

    case REQUEST_TASKS:
      return {
        ...state,
        isFetching: true,
        tasks: [],
        completedTasks: [],
        showingCompletedTasks: false,
      };

    case REQUEST_COMPLETED_TASKS:
      return { ...state, isCompletedTasksFetching: true };

    case REQUEST_HISTORY:
      return requestHistory(state, action);

    case HIDE_COMPLETED_TASKS:
      return { ...state, showingCompletedTasks: false, completedTasks: [] };

    case EDIT_TASK: {
      const { task } = action;
      return { ...state, task };
    }

    case MARK_TASK_STATUS_SUCCESS: {
      const { task, status, completedDt, completedBy } = action;
      const archivedByUser = true;
      const taskData = { status, completedBy, completedDt, archivedByUser };

      const tasks = updateTask(taskData, task, state.tasks);
      //Need to update the task otherwise the completed list is not updated
      if (!task.parentTaskId) {
        task.status = status;
        task.completedBy = completedBy;
        task.completedDt = completedDt;
        task.archivedByUser = archivedByUser;
      }
      return { ...state, tasks: tasks };
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS: {
      const { task, status, completedDt, completedBy } = action;
      const taskData = { status, completedBy, completedDt };

      const completedTasks = updateTask(taskData, task, state.completedTasks);

      return { ...state, completedTasks };
    }

    case DELETE_TASK_SUCCESS: {
      const mainTaskId = action.task.parentTaskId;

      if (mainTaskId) {
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.taskId === mainTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter(
                    ({ taskId }) => taskId !== action.task.taskId,
                  ),
                }
              : task,
          ),
        };
      }

      return {
        ...state,
        tasks: state.tasks.filter(
          ({ taskId }) => taskId !== action.task.taskId,
        ),
      };
    }

    case UPDATE_TASK_DESCRIPTION_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTask
            ? action.task.parentTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId
                      ? {
                          ...subtask,
                          description: action.description,
                        }
                      : subtask,
                  ),
                }
              : { ...task, description: action.description }
            : task,
        ),
      };
    }

    case UPDATE_TASK_DUE_DATE:
      return updateDueDate(state, action);

    case UPDATE_TASK_WORKFLOW_STATUS:
      return updateWorkflowStatus(state, action);

    case UPDATE_TASK_REMINDER:
      return updateReminder(state, action);

    case UPDATE_TASK_PATIENT:
      return updatePatient(state, action);

    case MOVE_TASK_SUCCESS: {
      const { task } = action;

      if (!isSubtask(task)) {
        return {
          ...state,
          tasks: state.tasks.filter(t => t.taskId !== task.taskId),
        };
      }

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskId !== task.parentTaskId
            ? t
            : {
                ...t,
                subtasks: t.subtasks.filter(
                  subtask => subtask.taskId !== task.taskId,
                ),
              },
        ),
      };
    }

    case MOVE_TASK_BETWEEN_LISTS: {
      const { task } = action;

      if (isSubtask(task)) {
        return state;
      }

      const { tasks, completedTasks } =
        task.status === 'COMPLETE'
          ? {
              tasks: state.tasks.filter(({ taskId }) => taskId !== task.taskId),
              completedTasks: [task, ...state.completedTasks],
            }
          : {
              completedTasks: state.completedTasks.filter(
                ({ taskId }) => taskId !== task.taskId,
              ),
              tasks: [task, ...state.tasks],
            };

      return {
        ...state,
        tasks,
        completedTasks,
      };
    }

    case UPDATE_TASK_SUCCESS: {
      const { task } = action;
      const mainTaskId = task.parentTaskId || task.taskId;

      const newState = {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.taskId !== mainTaskId) {
            return t;
          }

          if (!task.parentTaskId) {
            return { ...t, ...task };
          }

          return {
            ...t,
            subtasks: t.subtasks.map(subtask =>
              subtask.taskId === task.taskId
                ? { ...subtask, ...task }
                : subtask,
            ),
          };
        }),
      };

      return newState;
    }

    case TOGGLE_TASK_PRIORITY_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTask
            ? action.task.parentTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId
                      ? { ...subtask, priority: action.priority }
                      : subtask,
                  ),
                }
              : { ...task, priority: action.priority }
            : task,
        ),
      };
    }

    case ASSIGN_OR_REASSIGN_TASK_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTask
            ? action.task.parentTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId
                      ? {
                          ...subtask,
                          assignedTo: action.task.assignedTo,
                          assignedBy: action.task.assignedBy,
                          assignmentUpdatedDateTime:
                            action.task.assignmentUpdatedDateTime,
                        }
                      : subtask,
                  ),
                }
              : {
                  ...task,
                  assignedTo: action.task.assignedTo,
                  assignedBy: action.task.assignedBy,
                  assignmentUpdatedDateTime:
                    action.task.assignmentUpdatedDateTime,
                }
            : task,
        ),
      };
    }

    case ADD_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);
      // HACK - TODO: Make backend return correct initials and userName
      const comment = action.comment.data;
      comment.creator.initials =
        comment.creator.initials ||
        `${comment.creator.firstName.charAt(
          0,
        )} ${comment.creator.firstName.charAt(1)}`;
      comment.creator.userName = `${comment.creator.firstName} ${comment.creator.lastName}`;

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskId !== mainTaskId) {
            return task;
          }

          return action.task.parentTaskId
            ? {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.taskId === action.task.taskId
                    ? {
                        ...subtask,
                        comments: [comment].concat(subtask.comments),
                      }
                    : subtask,
                ),
              }
            : {
                ...task,
                comments: [comment].concat(task.comments),
              };
        }),
      };
    }

    case UPDATE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskId === mainTaskId) {
            if (action.task.parentTaskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => ({
                  ...subtask,
                  comments: subtask.comments.map(comment => {
                    if (comment.commentId === action.comment.commentId) {
                      return {
                        ...comment,
                        ...action.comment,
                        creator: comment.creator,
                      };
                    }

                    return comment;
                  }),
                })),
              };
            }

            return {
              ...task,
              comments: task.comments.map(comment =>
                comment.commentId === action.comment.commentId
                  ? {
                      ...comment,
                      ...action.comment,
                      creator: comment.creator,
                    }
                  : comment,
              ),
            };
          }

          return task;
        }),
      };
    }

    case DELETE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTaskId
            ? action.task.parentTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask === action.task
                      ? {
                          ...subtask,
                          comments: subtask.comments.filter(
                            comment =>
                              comment.commentId !== action.comment.commentId,
                          ),
                        }
                      : subtask,
                  ),
                }
              : {
                  ...task,
                  comments: task.comments.filter(
                    comment => comment.commentId !== action.comment.commentId,
                  ),
                }
            : task,
        ),
      };
    }

    case ADD_PATIENT_TO_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.taskId
            ? { ...task, patient: action.patient }
            : task,
        ),
      };

    case FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === mainTask
            ? action.task.parentTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskId === action.task.taskId
                      ? {
                          ...subtask,
                          read: action.task.read,
                          updated: action.task.updated,
                        }
                      : subtask,
                  ),
                }
              : {
                  ...task,
                  read: action.task.read,
                  updated: action.task.updated,
                }
            : task,
        ),
      };
    }

    case SET_AS_CURRENT_TASK:
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskId: action.task != null ? action.task.taskId : null,
      };

    case GET_TASK_HISTORY_SUCCESS:
      return requestHistorySuccess(state, action);

    case GET_TASK_HISTORY_ERROR:
      return requestHistoryError(state, action);

    case CLEAR_CURRENT_TASK_HISTORY:
      return clearHistory(state, action);

    case ORDER_SUB_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskId === action.task.taskId ? action.task : task,
        ),
      };

    case TASK_ATTACHMENT_ADDED: {
      const mainTaskId = action.taskId;
      const { taskAttachment } = action;

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskId === mainTaskId
            ? {
                ...t,
                attachments: [taskAttachment].concat(t.attachments),
              }
            : {
                ...t,
                subtasks: t.subtasks.map(st =>
                  st.taskId === mainTaskId
                    ? {
                        ...st,
                        attachments: [taskAttachment].concat(st.attachments),
                      }
                    : st,
                ),
              },
        ),
      };
    }

    case TASK_ATTACHMENT_REMOVED: {
      const mainTaskId = action.taskId;
      const { taskAttachmentId } = action;

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskId === mainTaskId
            ? {
                ...t,
                attachments: t.attachments.filter(
                  att => att.attachmentId !== taskAttachmentId,
                ),
              }
            : {
                ...t,
                subtasks: t.subtasks.map(st =>
                  st.taskId === mainTaskId
                    ? {
                        ...st,
                        attachments: st.attachments.filter(
                          att => att.attachmentId !== taskAttachmentId,
                        ),
                      }
                    : st,
                ),
              },
        ),
      };
    }

    case CHANGE_ADDING_NEW_SUBTASK: {
      const {
        addingNewSubtask,
        addingNewSubtaskParentId,
        subtaskShape,
      } = action;
      return {
        ...state,
        addingNewSubtask,
        addingNewSubtaskParentId,
        subtaskShape,
      };
    }

    case CHANGE_ADDING_NEW_TASK: {
      const { addingNewTask } = action;
      return {
        ...state,
        addingNewTask,
      };
    }

    case TASK_ARCHIVED: {
      const { task: actionTask, currentUserProfile } = action;

      return {
        ...state,
        completedTasks: state.completedTasks.map(task => {
          if (task.taskId === actionTask.taskId) {
            return {
              ...task,
              archivedByUser: true,
            };
          }

          return task;
        }),
      };
    }

    default:
      return state;
  }
};

export default TaskReducer;
