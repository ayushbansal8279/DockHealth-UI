import { isEmpty } from 'ramda';
import {
  ADD_TASK_COMMENT_SUCCESS,
  ADD_TASK_SUCCESS,
  DELETE_TASK_COMMENT_SUCCESS,
  DELETE_TASK_SUCCESS,
  DUPLICATE_TASK_SUCCESS,
  MOVE_TASK_SUCCESS,
  TASK_ATTACHMENT_ADDED,
  TASK_ATTACHMENT_REMOVED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_COMMENT_SUCCESS,
  REFRESH_ANOTHER_TASK_SUCCESS,
  OPEN_QUICK_ADD_SUBTASK_INPUT,
  CLOSE_QUICK_ADD_SUBTASK_INPUT,
  REQUEST_LOAD_SUBTASKS,
  LOAD_SUBTASKS_SUCCESS,
  UPDATE_TASKS_SUCCESS,
  DELETE_TASKS_SUCCESS,
  COMPLETE_TASKS_SUCCESS,
  LOAD_TASKS_FOR_BUNDLE,
} from 'actions/action-types';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { checkIfTaskMatchesSearch } from 'helpers/search-helpers';
import { TaskStatus } from 'helpers/task-helpers';

const getMainTaskId = ({ parentTaskIdentifier, taskIdentifier }) =>
  parentTaskIdentifier || taskIdentifier;

const isSubtask = ({ parentTaskIdentifier }) => parentTaskIdentifier !== null;
const isParentOfAddedTask = addedTask => ({ taskIdentifier }) =>
  taskIdentifier === addedTask.parentTaskIdentifier;

// eslint-disable-next-line sonarjs/cognitive-complexity
const TaskBaseReducer = (state, action, updateStateCallback) => {
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case ADD_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      const comment = action.comment.data;

      const updateTaskFromAction = tasks =>
        tasks.map(task => {
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

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const updateTaskFromAction = tasks => {
        const parentTask = tasks.find(({ taskIdentifier }) =>
          isParentOfAddedTask(addedTask)({ taskIdentifier }),
        );

        if (isSubtask(addedTask)) {
          addedTask.patient = parentTask?.patient;
        }

        return isSubtask(addedTask)
          ? tasks.map(task => {
              if (task.itemType === 'BUNDLE') {
                return {
                  ...task,
                  tasks: task.tasks.map(t => {
                    if (isParentOfAddedTask(addedTask)(t))
                      return {
                        ...t,
                        subtasks: t.subtasks.concat([addedTask]),
                        subTasksCount: t.subTasksCount + 1,
                      };

                    return t;
                  }),
                };
              }

              if (isParentOfAddedTask(addedTask)(task))
                return {
                  ...task,
                  subtasks: task.subtasks.concat([addedTask]),
                  subTasksCount: task.subTasksCount + 1,
                };

              return task;
            })
          : [addedTask].concat(tasks);
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case DELETE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      const updateTaskFromAction = tasks =>
        tasks.map(task => {
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

      return updateStateCallback(state, updateTaskFromAction);
    }

    case DELETE_TASK_SUCCESS: {
      const mainTaskId = action.task.parentTaskIdentifier;

      const updateTaskFromAction = tasks => {
        if (mainTaskId) {
          return tasks.map(task =>
            task.taskIdentifier === mainTaskId
              ? {
                  ...task,
                  subTasksCount: task.subTasksCount - 1,
                  subtasks: task.subtasks.filter(
                    ({ taskIdentifier }) =>
                      taskIdentifier !== action.task.taskIdentifier,
                  ),
                }
              : task,
          );
        }
        return tasks.filter(
          ({ taskIdentifier }) => taskIdentifier !== action.task.taskIdentifier,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case DUPLICATE_TASK_SUCCESS: {
      const mainTaskId = getMainTaskId(action.duplicatedTask);
      const { duplicatedTask } = action;

      const updateTaskFromAction = tasks => {
        if (duplicatedTask.parentTaskIdentifier) {
          return tasks.map(task =>
            task.taskIdentifier === mainTaskId
              ? {
                  ...task,
                  subTasksCount: task.subTasksCount + 1,
                  subtasks: [action.duplicatedTask, ...task.subtasks],
                }
              : task,
          );
        }
        return [action.duplicatedTask].concat(tasks);
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case OPEN_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;

      if (taskIdentifier) {
        const updateTaskFromAction = tasks => {
          return tasks.map(task => {
            if (task.itemType === 'BUNDLE') {
              return {
                ...task,
                tasks: task.tasks.map(t => {
                  if (t.taskIdentifier === taskIdentifier) {
                    return {
                      ...t,
                      subtaskQuickAddOpen: true,
                    };
                  }

                  return t;
                }),
              };
            }

            if (task.taskIdentifier === taskIdentifier) {
              return {
                ...task,
                subtaskQuickAddOpen: true,
              };
            }

            return task;
          });
        };

        return updateStateCallback(state, updateTaskFromAction);
      }

      return state;
    }

    case CLOSE_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;

      if (taskIdentifier) {
        const updateTaskFromAction = tasks => {
          return tasks.map(task => {
            if (task.itemType === 'BUNDLE') {
              return {
                ...task,
                tasks: task.tasks.map(t => {
                  if (t.taskIdentifier === taskIdentifier) {
                    return {
                      ...t,
                      subtaskQuickAddOpen: false,
                    };
                  }

                  return t;
                }),
              };
            }

            if (task.taskIdentifier === taskIdentifier)
              return {
                ...task,
                subtaskQuickAddOpen: false,
              };

            return task;
          });
        };

        return updateStateCallback(state, updateTaskFromAction);
      }

      return state;
    }

    case MOVE_TASK_SUCCESS: {
      const { task } = action;

      const updateTaskFromAction = tasks => {
        if (!isSubtask(task)) {
          return tasks.filter(t => t.taskIdentifier !== task.taskIdentifier);
        }
        return tasks.map(t =>
          t.taskIdentifier !== task.parentTaskIdentifier
            ? t
            : {
                ...t,
                subtasks: t.subtasks.filter(
                  subtask => subtask.taskIdentifier !== task.taskIdentifier,
                ),
              },
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case TASK_ATTACHMENT_ADDED: {
      const mainTaskId = action.taskIdentifier;
      const { taskAttachment } = action;

      const updateTaskFromAction = tasks =>
        tasks.map(t =>
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
        );

      return updateStateCallback(state, updateTaskFromAction);
    }

    case TASK_ATTACHMENT_REMOVED: {
      const mainTaskId = action.taskIdentifier;
      const { taskAttachmentId } = action;

      const updateTaskFromAction = tasks =>
        tasks.map(t =>
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
        );

      return updateStateCallback(state, updateTaskFromAction);
    }

    case REQUEST_LOAD_SUBTASKS: {
      const { task } = action;

      const updateTaskFromAction = tasks =>
        tasks.map(t => {
          if (
            t.taskIdentifier !== task.parentTaskIdentifier &&
            t.taskIdentifier !== task.taskIdentifier
          ) {
            return t;
          }

          if (task.taskIdentifier === t.taskIdentifier) {
            return { ...t, ...task, isFetchingSubTasks: true };
          }

          return {
            ...t,
          };
        });

      return updateStateCallback(state, updateTaskFromAction);
    }

    case UPDATE_TASK_SUCCESS:
    case LOAD_SUBTASKS_SUCCESS:
    case REFRESH_ANOTHER_TASK_SUCCESS: {
      let { task } = action;

      if (action.type === LOAD_SUBTASKS_SUCCESS) {
        task = { ...task, isFetchingSubTasks: false };
      }

      const updateTaskFromAction = tasks =>
        tasks.map(t => {
          if (
            t.taskIdentifier !== task.parentTaskIdentifier &&
            t.taskIdentifier !== task.taskIdentifier &&
            task.parentTaskIdentifier !== undefined
          ) {
            return t;
          }

          if (task.taskIdentifier === t.taskIdentifier) {
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
        });

      return updateStateCallback(state, updateTaskFromAction);
    }

    case UPDATE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      const updateTaskFromAction = tasks =>
        tasks.map(task => {
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
        });

      return updateStateCallback(state, updateTaskFromAction);
    }

    case UPDATE_TASKS_SUCCESS: {
      const { tasksToUpdate, fields, filters, searchValue } = action;
      const updateTasksFromAction = currentTasks => {
        let newTasks = currentTasks?.map(task => {
          let newTask = task;
          if (tasksToUpdate?.includes(newTask?.taskIdentifier)) {
            newTask = { ...newTask, ...fields };
          }

          if (newTask?.subtasks?.length > 0) {
            newTask.subtasks = newTask?.subtasks?.map(subtask => {
              if (tasksToUpdate?.includes(subtask?.taskIdentifier)) {
                if (
                  fields.status === TaskStatus.COMPLETE &&
                  subtask.status === TaskStatus.INCOMPLETE
                ) {
                  newTask.subTasksCompletedCount += 1;
                }

                if (
                  fields.status === TaskStatus.INCOMPLETE &&
                  subtask.status === TaskStatus.COMPLETE
                ) {
                  newTask.subTasksCompletedCount -= 1;
                }

                return { ...subtask, ...fields };
              }

              return subtask;
            });
          }

          return newTask;
        });

        if (!isEmpty(filters)) {
          newTasks = newTasks.filter(task =>
            checkIfTaskMatchesFilters(task, filters),
          );
        }

        if (searchValue && searchValue !== '') {
          newTasks = newTasks.filter(task =>
            checkIfTaskMatchesSearch(task, searchValue),
          );
        }

        return newTasks;
      };
      return updateStateCallback(state, updateTasksFromAction);
    }
    case DELETE_TASKS_SUCCESS: {
      const { tasksToDelete } = action;
      const updateTasksFromAction = currentTasks =>
        currentTasks
          ?.filter(task => {
            if (tasksToDelete?.includes(task?.taskIdentifier)) {
              return false;
            }

            return true;
          })
          .map(task => {
            if (task?.subtasks?.length > 0) {
              const subtasks = task?.subtasks?.filter(
                subtask => !tasksToDelete?.includes(subtask?.taskIdentifier),
              );
              return {
                ...task,
                subtasks,
                subTasksCount: subtasks?.length || 0,
              };
            }

            return task;
          });

      return updateStateCallback(state, updateTasksFromAction);
    }

    case COMPLETE_TASKS_SUCCESS: {
      const { tasksToDelete } = action;
      const updateTasksFromAction = currentTasks =>
        // eslint-disable-next-line sonarjs/no-identical-functions
        currentTasks?.filter(task => {
          if (tasksToDelete?.includes(task?.taskIdentifier)) {
            return false;
          }

          return true;
        });

      return updateStateCallback(state, updateTasksFromAction);
    }

    case LOAD_TASKS_FOR_BUNDLE: {
      const { bundleIdentifier, tasks } = action;

      const updateTasksFromAction = currentTasks =>
        currentTasks?.map(t =>
          t.itemType === 'BUNDLE' && t.identifier === bundleIdentifier
            ? { ...t, tasks }
            : t,
        );

      return updateStateCallback(state, updateTasksFromAction);
    }

    default:
      return state;
  }
};

export default TaskBaseReducer;
