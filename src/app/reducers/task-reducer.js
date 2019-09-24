import {
  map, equals, when, always, assoc, evolve, propEq, identity, unless, uncurryN, ifElse,
} from 'ramda';
import {
  ADD_PATIENT_TO_TASK_SUCCESS,
  ADD_TASK_COMMENT_SUCCESS,
  ADD_TASK_SUCCESS,
  ASSIGN_OR_REASSIGN_TASK_SUCCESS,
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
  MOVE_TASK_SUCCESS, ORDER_SUB_TASK_SUCCESS,
  REQUEST_COMPLETED_TASKS,
  REQUEST_HISTORY,
  REQUEST_TASKS,
  SET_AS_CURRENT_TASK,
  TOGGLE_TASK_PRIORITY_SUCCESS,
  UPDATE_TASK_COMMENT_SUCCESS,
  UPDATE_TASK_DESCRIPTION_SUCCESS,
  UPDATE_TASK_DUE_DATE,
  UPDATE_TASK_PATIENT,
  UPDATE_TASK_REMINDER,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_WORKFLOW_STATUS,
  SHOW_SUBTASKS,
  HIDE_SUBTASKS,
  TASK_ATTACHMENT_ADDED,
  TASK_ATTACHMENT_REMOVED

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
  selectedTaskId: null,

};

const getMainTaskId = ({ parentTaskId, taskId }) => parentTaskId || taskId;

const updateTaskOrSubtask = (tasks, taskId, update) => {
  const updatedTasks = tasks.map(t => (
    t.taskId === taskId
      ? update(t)
      : ({ ...t, subtasks: t.subtasks.map(st => (st.taskId === taskId ? update(st) : st)) })
  ));

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
  return ({ ...state, tasks: updatedTasks });
};

const updateWorkflowStatus = (state, { taskId, workflowStatus }) => {
  const updateStatus = t => ({ ...t, workflowStatus });
  const updatedTasks = updateTaskOrSubtask(state.tasks, taskId, updateStatus);
  return ({ ...state, tasks: updatedTasks });
};

const updatePatient = (state, { parentTaskId, patient }) => ({
  ...state,
  tasks: state.tasks.map(task => (task.taskId === parentTaskId
    ? ({ ...task, patient, subtasks: task.subtasks.map(subtask => ({ ...subtask, patient })) })
    : task)),
});

const updateReminder = (state, { taskId, reminderDt }) => {
  const updateStatus = t => ({ ...t, reminderDt });
  const updatedTasks = updateTaskOrSubtask(state.tasks, taskId, updateStatus);
  return ({ ...state, tasks: updatedTasks });
};

const TASK_COMPLETE = 'COMPLETE';

const updateMainTaskStatus = status => evolve({
  status: always(status),
  subtasks:
    equals(status, TASK_COMPLETE)
      ? map(assoc('status', status))
      : identity,
});

const updateSubTaskStatus = (status, subtask) => evolve({
  subtasks: map(when(
    propEq('taskId', subtask.taskId),
    assoc('status', status),
  )),
});

const updateTaskStatus = uncurryN(3,
  status => task => map(when(
    propEq('taskId', task.parentTaskId || task.taskId),
    ifElse(
      propEq('taskId', task.taskId),
      updateMainTaskStatus(status),
      unless(
        propEq('status', TASK_COMPLETE),
        updateSubTaskStatus(status, task),
      ),
    ),
  )));

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const isSubtask = ({ parentTaskId }) => parentTaskId !== null;
      const isParentOfAddedTask = ({ taskId }) => taskId === addedTask.parentTaskId;

      const tasks = isSubtask(addedTask)
        ? state.tasks.map(task => (isParentOfAddedTask(task)
          ? { ...task, subtasks: [addedTask].concat(task.subtasks) }
          : task))
        : [addedTask].concat(state.tasks);

      return { ...state, tasks };
    }

    case DUPLICATE_TASK_SUCCESS:
      // with concact make a copy of the array, and then we'll change and return the copy
      return {
        ...state,
        tasks: [action.duplicatedTask].concat(state.tasks),
      };

    case GET_TASKS_SUCCESS: {
      // isFetching is used for the loading image
      const { tasks } = action;
      return { ...state, tasks, isFetching: false };
    }

    case GET_COMPLETED_TASKS_SUCCESS: {
      const { tasks } = action;
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
      const { task, status } = action;
      const tasks = updateTaskStatus(status, task, state.tasks);

      return { ...state, tasks };
    }

    case MARK_COMPLETE_TASK_STATUS_SUCCESS: {
      const { task, status } = action;
      const completedTasks = updateTaskStatus(status, task, state.completedTasks);

      return { ...state, completedTasks };
    }

    case DELETE_TASK_SUCCESS: {
      const mainTaskId = action.task.parentTaskId;

      if (mainTaskId) {
        return {
          ...state,
          tasks: state.tasks.map(task => (task.taskId === mainTaskId
            ? { ...task, subtasks: task.subtasks.filter(({ taskId }) => taskId !== action.task.taskId) }
            : task)),
        };
      }

      return {
        ...state,
        tasks: state.tasks.filter(({ taskId }) => taskId !== action.task.taskId),
      };
    }

    case UPDATE_TASK_DESCRIPTION_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTask
          ? action.task.parentTaskId
            ? {
              ...task,
              read: false,
              subtasks:
            task.subtasks.map(subtask => (subtask.taskId === action.task.taskId
              ? { ...subtask, read: false, description: action.description }
              : subtask)),
            }
            : { ...task, read: false, description: action.description }
          : task)),
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
      const isSubtask = Boolean(task.parentTaskId);

      if (!isSubtask) {
        return ({
          ...state,
          tasks: state.tasks.filter(t => t.taskId !== task.taskId),
        });
      }

      return ({
        ...state,
        tasks: state.tasks.map(t => (t.taskId !== task.parentTaskId
          ? t
          : ({
            ...t,
            subtasks: t.subtasks.filter(subtask => subtask.taskId !== task.taskId),
          }))),
      });
    }

    case UPDATE_TASK_SUCCESS: {
      const { task } = action;
      const mainTaskId = task.parentTaskId || task.taskId;

      const newState = {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.taskId !== mainTaskId) {
            return t;
          }

          if (!task.parentTaskId) {
            return ({ ...t, ...task });
          }

          return ({
            ...t,
            read: false,
            subtasks: t.subtasks.map(subtask => (subtask.taskId === task.taskId
              ? { ...subtask, ...task }
              : subtask)),
          });
        }),
      };

      return newState;
    }

    case TOGGLE_TASK_PRIORITY_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTask
          ? action.task.parentTaskId
            ? {
              ...task,
              subtasks:
              task.subtasks.map(subtask => (subtask.taskId === action.task.taskId
                ? { ...subtask, priority: action.priority }
                : subtask)),
            }
            : { ...task, priority: action.priority }
          : task)),
      };
    }

    case ASSIGN_OR_REASSIGN_TASK_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTask
          ? action.task.parentTaskId
            ? {
              ...task,
              subtasks:
            task.subtasks.map(subtask => (subtask.taskId === action.task.taskId
              ? {
                ...subtask,
                assignedTo: action.task.assignedTo,
                assignedBy: action.task.assignedBy,
                assignmentUpdatedDateTime: action.task.assignmentUpdatedDateTime,
              }
              : subtask)),
            }
            : {
              ...task,
              assignedTo: action.task.assignedTo,
              assignedBy: action.task.assignedBy,
              assignmentUpdatedDateTime: action.task.assignmentUpdatedDateTime,
            }
          : task)),
      };
    }

    case ADD_TASK_COMMENT_SUCCESS: {
      const mainTask = getMainTaskId(action.task);
      // HACK - TODO: Make backend return correct initials and userName
      const comment = action.comment.data;
      comment.creator.initials = comment.creator.initials || `${comment.creator.firstName.charAt(0)} ${comment.creator.firstName.charAt(1)}`;
      comment.creator.userName = `${comment.creator.firstName} ${comment.creator.lastName}`;

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTask
          ? action.task.parentTaskId
            ? {
              ...task,
              read: false,
              subtasks:
                  task.subtasks.map(subtask => (subtask.taskId === action.task.taskId
                    ? { ...subtask, read: false, comments: [comment].concat(subtask.comments) }
                    : subtask)),
            }
            : { ...task, read: false, comments: [comment].concat(task.comments) }

          : task)),
      };
    }

    case UPDATE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTaskId
          ? action.task.parentTaskId
            ? {
              ...task,
              subtasks:
                task.subtasks.map(subtask => (subtask === action.task
                  ? {
                    ...subtask,
                    comments:
                    subtask.comments.map(comment => (comment.commentId === action.comment.commentId
                      ? { ...comment, comment: action.comment.comment }
                      : comment)),
                  }
                  : subtask)),
            }
            : {
              ...task,
              comments:
                task.comments.map(comment => (comment.commentId === action.comment.commentId
                  ? { ...comment, comment: action.comment.comment }
                  : comment)),
            }
          : task)),
      };
    }

    case DELETE_TASK_COMMENT_SUCCESS: {
      const mainTaskId = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTaskId
          ? action.task.parentTaskId
            ? {
              ...task,
              subtasks:
                  task.subtasks.map(subtask => (subtask === action.task
                    ? { ...subtask, comments: subtask.comments.filter(comment => comment.commentId !== action.comment.commentId) }
                    : subtask)),
            }
            : { ...task, comments: task.comments.filter(comment => comment.commentId !== action.comment.commentId) }
          : task)),
      };
    }

    case ADD_PATIENT_TO_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === action.taskId
          ? { ...task, patient: action.patient }
          : task)),
      };

    case FLAG_TASK_AS_READ_OR_UNREAD_SUCCESS: {
      const mainTask = getMainTaskId(action.task);

      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === mainTask
          ? action.task.parentTaskId
            ? {
              ...task,
              subtasks:
                  task.subtasks.map(subtask => (subtask.taskId === action.task.taskId
                    ? { ...subtask, read: !action.task.read }
                    : subtask)),
            }
            : { ...task, read: !action.task.read }

          : task)),
      };
    }

    case SET_AS_CURRENT_TASK:
      return { ...state, selectedTaskId: action.taskId };

    case GET_TASK_HISTORY_SUCCESS:
      return requestHistorySuccess(state, action);

    case GET_TASK_HISTORY_ERROR:
      return requestHistoryError(state, action);

    case CLEAR_CURRENT_TASK_HISTORY:
      return clearHistory(state, action);

    case ORDER_SUB_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task => (task.taskId === action.task.taskId ? action.task : task)),
      };

    case TASK_ATTACHMENT_ADDED:
      var mainTaskId = action.taskId
      var taskAttachment = action.taskAttachment

      return{
        ...state,
        tasks: state.tasks.map(t => (t.taskId === mainTaskId
          ? {...t, read:false, attachments: [taskAttachment].concat(t.attachments)}
          : ({ ...t, subtasks: t.subtasks.map(st => (st.taskId === mainTaskId ?
            {...st, read:false, attachments: [taskAttachment].concat(st.attachments)}
            : st)) })
        ))
      };

    case TASK_ATTACHMENT_REMOVED:
      var mainTaskId = action.taskId
      var taskAttachmentId = action.taskAttachmentId

      return {
          ...state,
          tasks: state.tasks.map(t => (t.taskId === mainTaskId
            ? {...t, read:false, attachments: t.attachments.filter(att => att.attachmentId !== taskAttachmentId)}
            : ({ ...t, subtasks: t.subtasks.map(st => (st.taskId === mainTaskId ?
              {...st, read:false, attachments: st.attachments.filter(att => att.attachmentId !== taskAttachmentId)}
              : st)) })
          ))
      };

    default:
      return state;
  }
};


export default TaskReducer;
