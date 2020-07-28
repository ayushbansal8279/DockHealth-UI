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
  ADD_TASK_COMMENT_SUCCESS,
  ADD_TASK_SUCCESS,
  DELETE_TASK_COMMENT_SUCCESS,
  DELETE_TASK_SUCCESS,
  DUPLICATE_TASK_SUCCESS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  MARK_TASK_STATUS_SUCCESS,
  MOVE_TASK_SUCCESS,
  TASK_ARCHIVED,
  TASK_ATTACHMENT_ADDED,
  TASK_ATTACHMENT_REMOVED,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_COMMENT_SUCCESS,
  REFRESH_ANOTHER_TASK_SUCCESS,
} from 'actions/action-types';

const getMainTaskId = ({ parentTaskIdentifier, taskIdentifier }) =>
  parentTaskIdentifier || taskIdentifier;

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
          ? tasks.map(task =>
              isParentOfAddedTask(addedTask)(task)
                ? { ...task, subtasks: task.subtasks.concat([addedTask]) }
                : task,
            )
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
      const updateTaskFromAction = tasks =>
        tasks.concat([action.duplicatedTask]);

      return updateStateCallback(state, updateTaskFromAction);
    }

    case MARK_TASK_STATUS_SUCCESS: {
      const { task, status, completedDt, completedBy } = action;
      const archivedByUser = true;
      const taskData = { status, completedBy, completedDt, archivedByUser };

      // Need to update the task otherwise the completed list is not updated
      if (!task.parentTaskIdentifier) {
        task.status = status;
        task.completedBy = completedBy;
        task.completedDt = completedDt;
        task.archivedByUser = archivedByUser;
      }

      const updateTaskFromAction = tasks => updateTask(taskData, task, tasks);

      return updateStateCallback(state, updateTaskFromAction);
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS: {
      const { task, status, completedDt, completedBy } = action;
      const taskData = { status, completedBy, completedDt };

      const updateTaskFromAction = tasks => updateTask(taskData, task, tasks);

      return updateStateCallback(state, updateTaskFromAction);
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

    case TASK_ARCHIVED: {
      const { task: actionTask } = action;

      const updateTaskFromAction = tasks =>
        tasks.map(task => {
          if (task.taskIdentifier === actionTask.taskIdentifier) {
            return {
              ...task,
              archivedByUser: true,
            };
          }

          return task;
        });

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

    case UPDATE_TASK_SUCCESS:
    case REFRESH_ANOTHER_TASK_SUCCESS: {
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

    default:
      return state;
  }
};

export default TaskBaseReducer;
