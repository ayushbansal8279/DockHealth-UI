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
  CLEAR_TASKS_SEARCH,
  DELETE_TASK_COMMENT_SUCCESS,
  DELETE_TASK_SUCCESS,
  DUPLICATE_TASK_SUCCESS,
  EDIT_TASK,
  FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE,
  GET_TASK_HISTORY_ERROR,
  GET_TASK_HISTORY_SUCCESS,
  GET_TASKS_SUCCESS,
  HIDE_COMPLETED_TASKS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  MARK_TASK_STATUS_SUCCESS,
  MOVE_TASK_BETWEEN_LISTS,
  MOVE_TASK_SUCCESS,
  ORDER_SUB_TASK_SUCCESS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_HISTORY,
  REQUEST_TASKS,
  SET_AS_CURRENT_TASK,
  SET_AS_CURRENT_TASK_WITH_SELECTED_TASK_CHECK,
  TASK_ARCHIVED,
  TASK_ATTACHMENT_ADDED,
  TASK_ATTACHMENT_REMOVED,
  TASK_NEW_PAGE_DOWNLOADED,
  TOGGLE_TASK_PRIORITY_SUCCESS,
  UPDATE_TASK_COMMENT_SUCCESS,
  UPDATE_TASK_DESCRIPTION_SUCCESS,
  UPDATE_TASK_DUE_DATE,
  UPDATE_TASK_PATIENT,
  UPDATE_TASK_REMINDER,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_WORKFLOW_STATUS,
  UPDATED_SUBTASK_ORDER,
} from '../actions/action-types';

const initialState = {
  completedTasks: [],
  tasks: [],
  newlyAddedTaskIds: [],
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

const getMainTaskId = ({ parentTaskIdentifier, taskIdentifier }) =>
  parentTaskIdentifier || taskIdentifier;

const updateTaskOrSubtask = (tasks, taskIdentifier, update) => {
  return tasks.map(t =>
    t.taskIdentifier === taskIdentifier
      ? update(t)
      : {
          ...t,
          subtasks: t.subtasks.map(st =>
            st.taskIdentifier === taskIdentifier ? update(st) : st,
          ),
        },
  );
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

const updateDueDate = (state, { taskIdentifier, dueDate }) => {
  const updateStatus = t => ({ ...t, dueDate });
  const updatedTasks = updateTaskOrSubtask(
    state.tasks,
    taskIdentifier,
    updateStatus,
  );
  return { ...state, tasks: updatedTasks };
};

const updateWorkflowStatus = (state, { taskIdentifier, workflowStatus }) => {
  const updateStatus = t => ({ ...t, workflowStatus });
  const updatedTasks = updateTaskOrSubtask(
    state.tasks,
    taskIdentifier,
    updateStatus,
  );
  return { ...state, tasks: updatedTasks };
};

const updatePatient = (state, { parentTaskIdentifier, patient }) => ({
  ...state,
  tasks: state.tasks.map(task =>
    task.taskIdentifier === parentTaskIdentifier
      ? {
          ...task,
          patient,
          subtasks: task.subtasks.map(subtask => ({ ...subtask, patient })),
        }
      : task,
  ),
});

const updateReminder = (state, { taskIdentifier, reminderDt }) => {
  const updateStatus = t => ({ ...t, reminderDt });
  const updatedTasks = updateTaskOrSubtask(
    state.tasks,
    taskIdentifier,
    updateStatus,
  );
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
      when(
        propEq('taskIdentifier', subtask.taskIdentifier),
        mergeDeepLeft(taskData),
      ),
    ),
  });

const updateTask = uncurryN(3, taskData => task =>
  map(
    when(
      propEq(
        'taskIdentifier',
        task.parentTaskIdentifier || task.taskIdentifier,
      ),
      ifElse(
        propEq('taskIdentifier', task.taskIdentifier),
        updateMainTask(taskData),
        unless(propEq('status', TASK_COMPLETE), updateSubTask(taskData, task)),
      ),
    ),
  ),
);

const isSubtask = ({ parentTaskIdentifier }) => parentTaskIdentifier !== null;
const isParentOfAddedTask = addedTask => ({ taskIdentifier }) =>
  taskIdentifier === addedTask.parentTaskIdentifier;

const mapTasksSuccess = task => ({
  ...task,
  subtasks: task.subtasks?.map(subtask => ({
    ...subtask,
    patient: task.patient,
  })),
});

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const parentTask = state.tasks.find(({ taskIdentifier }) =>
        isParentOfAddedTask(addedTask)({ taskIdentifier }),
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

      return {
        ...state,
        tasks,
        newlyAddedTaskIds: [
          addedTask.taskIdentifier,
          ...(state.newlyAddedTaskIds || []),
        ],
      };
    }

    case DUPLICATE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.concat([action.duplicatedTask]),
        newlyAddedTaskIds: [
          action.duplicatedTask.taskIdentifier,
          ...(state.newlyAddedTaskIds || []),
        ],
      };

    case GET_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return { ...state, tasks, isFetching: false };
    }

    case GET_COMPLETED_TASKS_SUCCESS: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: tasks,
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
      };
    }

    case GET_COMPLETED_TASKS_SUCCESS_CUMULATIVE: {
      let { tasks } = action;

      tasks = tasks.map(mapTasksSuccess);

      return {
        ...state,
        completedTasks: state.completedTasks.concat(tasks),
        isCompletedTasksFetching: false,
        showingCompletedTasks: true,
        isFetching: false,
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
      return {
        ...state,
        completedTasks: [],
        isCompletedTasksFetching: true,
      };

    case CLEAR_TASKS_SEARCH:
      return {
        ...state,
        tasks: [],
        completedTasks: [],
      };

    case REQUEST_HISTORY:
      return requestHistory(state);

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

      // Need to update the task otherwise the completed list is not updated
      if (!task.parentTaskIdentifier) {
        task.status = status;
        task.completedBy = completedBy;
        task.completedDt = completedDt;
        task.archivedByUser = archivedByUser;
      }

      return { ...state, tasks };
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS: {
      const { task, status, completedDt, completedBy } = action;
      const taskData = { status, completedBy, completedDt };

      const completedTasks = updateTask(taskData, task, state.completedTasks);

      return { ...state, completedTasks };
    }

    case DELETE_TASK_SUCCESS: {
      const mainTaskId = action.task.parentTaskIdentifier;

      if (mainTaskId) {
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.taskIdentifier === mainTaskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter(
                    ({ taskIdentifier }) =>
                      taskIdentifier !== action.task.taskIdentifier,
                  ),
                }
              : task,
          ),
        };
      }

      return {
        ...state,
        tasks: state.tasks.filter(
          ({ taskIdentifier }) => taskIdentifier !== action.task.taskIdentifier,
        ),
      };
    }

    case UPDATE_TASK_DESCRIPTION_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTask) {
            return action.task.parentTaskIdentifier
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskIdentifier === action.task.taskIdentifier
                      ? {
                          ...subtask,
                          description: action.description,
                        }
                      : subtask,
                  ),
                }
              : { ...task, description: action.description };
          }

          return task;
        }),
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
          tasks: state.tasks.filter(
            t => t.taskIdentifier !== task.taskIdentifier,
          ),
        };
      }

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskIdentifier !== task.parentTaskIdentifier
            ? t
            : {
                ...t,
                subtasks: t.subtasks.filter(
                  subtask => subtask.taskIdentifier !== task.taskIdentifier,
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
              tasks: state.tasks.filter(
                ({ taskIdentifier }) => taskIdentifier !== task.taskIdentifier,
              ),
              completedTasks: [task, ...state.completedTasks],
            }
          : {
              completedTasks: state.completedTasks.filter(
                ({ taskIdentifier }) => taskIdentifier !== task.taskIdentifier,
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
      const mainTaskId = task.parentTaskIdentifier || task.taskIdentifier;

      return {
        ...state,
        tasks: state.tasks.map(t => {
          if (t.taskIdentifier !== mainTaskId) {
            return t;
          }

          if (!task.parentTaskIdentifier) {
            return { ...t, ...task };
          }

          return {
            ...t,
            subtasks: t.subtasks.map(subtask =>
              subtask.taskIdentifier === task.taskIdentifier
                ? { ...subtask, ...task }
                : subtask,
            ),
          };
        }),
      };
    }

    case TOGGLE_TASK_PRIORITY_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTask) {
            return action.task.parentTaskIdentifier
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskIdentifier === action.task.taskIdentifier
                      ? { ...subtask, priority: action.priority }
                      : subtask,
                  ),
                }
              : { ...task, priority: action.priority };
          }

          return task;
        }),
      };
    }

    case ASSIGN_OR_REASSIGN_TASK_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTask) {
            return action.task.parentTaskIdentifier
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskIdentifier === action.task.taskIdentifier
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
                };
          }

          return task;
        }),
      };
    }

    case ADD_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      const comment = action.comment.data;
      const newTasks = state.tasks.map(task => {
        if (task.taskIdentifier !== mainTaskId) {
          return task;
        }

        return action.task.parentTaskIdentifier
          ? {
              ...task,
              subtasks: task.subtasks.map(subtask =>
                subtask.taskIdentifier === action.task.taskIdentifier
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
      });

      const newSelectedTask =
        (action.task.parentTaskIdentifier
          ? newTasks
              .flatMap(({ subtasks }) => subtasks)
              .find(
                ({ taskIdentifier }) =>
                  taskIdentifier === action.task.taskIdentifier,
              )
          : newTasks.find(
              ({ taskIdentifier }) =>
                taskIdentifier === action.task.taskIdentifier,
            )) ?? state.selectedTask;

      return {
        ...state,
        selectedTask: newSelectedTask,
        selectedTaskId: newSelectedTask.taskIdentifier,
        tasks: newTasks,
      };
    }

    case UPDATE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTaskId) {
            if (action.task.parentTaskIdentifier) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => ({
                  ...subtask,
                  comments: subtask.comments.map(comment => {
                    if (
                      comment.commentIdentifier ===
                      action.comment.commentIdentifier
                    ) {
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
                comment.commentIdentifier === action.comment.commentIdentifier
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

      const newTasks = state.tasks.map(task => {
        if (task.taskIdentifier === mainTaskId) {
          return action.task.parentTaskIdentifier
            ? {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.taskIdentifier === action.task.taskIdentifier
                    ? {
                        ...subtask,
                        comments: subtask.comments.filter(
                          comment =>
                            comment.commentIdentifier !==
                            action.comment.commentIdentifier,
                        ),
                      }
                    : subtask,
                ),
              }
            : {
                ...task,
                comments: task.comments.filter(
                  comment =>
                    comment.commentIdentifier !==
                    action.comment.commentIdentifier,
                ),
              };
        }

        return task;
      });

      const newSelectedTask =
        (action.task.parentTaskIdentifier
          ? newTasks
              .flatMap(({ subtasks }) => subtasks)
              .find(
                ({ taskIdentifier }) =>
                  taskIdentifier === action.task.taskIdentifier,
              )
          : newTasks.find(
              ({ taskIdentifier }) =>
                taskIdentifier === action.task.taskIdentifier,
            )) ?? state.selectedTask;

      return {
        ...state,
        selectedTask: newSelectedTask,
        selectedTaskId: newSelectedTask.taskIdentifier,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTaskId) {
            return action.task.parentTaskIdentifier
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask === action.task
                      ? {
                          ...subtask,
                          comments: subtask.comments.filter(
                            comment =>
                              comment.commentIdentifier !==
                              action.comment.commentIdentifier,
                          ),
                        }
                      : subtask,
                  ),
                }
              : {
                  ...task,
                  comments: task.comments.filter(
                    comment =>
                      comment.commentIdentifier !==
                      action.comment.commentIdentifier,
                  ),
                };
          }

          return task;
        }),
      };
    }

    case ADD_PATIENT_TO_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskIdentifier === action.taskIdentifier
            ? { ...task, patient: action.patient }
            : task,
        ),
      };

    case FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => {
          if (task.taskIdentifier === mainTask) {
            return action.task.parentTaskIdentifier
              ? {
                  ...task,
                  subtasks: task.subtasks.map(subtask =>
                    subtask.taskIdentifier === action.task.taskIdentifier
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
                };
          }

          return task;
        }),
      };
    }

    case SET_AS_CURRENT_TASK:
      return {
        ...state,
        selectedTask: action.task,
        selectedTaskId: action.task != null ? action.task.taskIdentifier : null,
      };

    case SET_AS_CURRENT_TASK_WITH_SELECTED_TASK_CHECK:
      if (state.selectedTask) {
        return {
          ...state,
          selectedTask: action.task,
          selectedTaskId:
            action.task != null ? action.task.taskIdentifier : null,
        };
      }

      return state;

    case GET_TASK_HISTORY_SUCCESS:
      return requestHistorySuccess(state, action);

    case GET_TASK_HISTORY_ERROR:
      return requestHistoryError(state, action);

    case CLEAR_CURRENT_TASK_HISTORY:
      return clearHistory(state);

    case ORDER_SUB_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskIdentifier === action.task.taskIdentifier
            ? action.task
            : task,
        ),
      };

    case TASK_ATTACHMENT_ADDED: {
      const mainTaskId = action.taskIdentifier;
      const { taskAttachment } = action;

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskIdentifier === mainTaskId
            ? {
                ...t,
                attachments: [taskAttachment].concat(t.attachments),
              }
            : {
                ...t,
                subtasks: t.subtasks.map(st =>
                  st.taskIdentifier === mainTaskId
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
      const mainTaskId = action.taskIdentifier;
      const { taskAttachmentId } = action;

      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.taskIdentifier === mainTaskId
            ? {
                ...t,
                attachments: t.attachments.filter(
                  att => att.attachmentIdentifier !== taskAttachmentId,
                ),
              }
            : {
                ...t,
                subtasks: t.subtasks.map(st =>
                  st.taskIdentifier === mainTaskId
                    ? {
                        ...st,
                        attachments: st.attachments.filter(
                          att => att.attachmentIdentifier !== taskAttachmentId,
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
      const { task: actionTask } = action;

      return {
        ...state,
        completedTasks: state.completedTasks.map(task => {
          if (task.taskIdentifier === actionTask.taskIdentifier) {
            return {
              ...task,
              archivedByUser: true,
            };
          }

          return task;
        }),
      };
    }

    case TASK_NEW_PAGE_DOWNLOADED: {
      const { tasks: actionTasks } = action;

      return {
        ...state,
        tasks: [...(state.tasks || []), ...(actionTasks || [])],
      };
    }

    case UPDATED_SUBTASK_ORDER: {
      const { task: actionTask } = action;

      return {
        ...state,
        tasks: state.tasks.map(task => {
          const { taskIdentifier } = task;
          if (taskIdentifier === actionTask?.taskIdentifier) {
            return { ...task, subtasks: actionTask.subtasks };
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
