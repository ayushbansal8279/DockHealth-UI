/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty } from 'ramda';
import * as ActionTypes from 'actions/action-types';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { checkIfTaskMatchesSearch } from 'helpers/search-helpers';
import {
  TaskStatus,
  updateNestedTask,
  updateSubtasksInTaskWithCallback,
} from 'helpers/task-helpers';

const TaskBaseReducer = (state, action, updateStateCallback) => {
  switch (action.type) {
    case ActionTypes.ADD_TASK_COMMENT_SUCCESS: {
      const {
        task: { taskIdentifier },
        comment: { data: comment },
      } = action;

      const updateTaskFromAction = task => {
        if (task.taskIdentifier === taskIdentifier) {
          return {
            ...task,
            comments: [comment].concat(task.comments),
          };
        }

        return updateSubtasksInTaskWithCallback(
          subtask => ({
            ...subtask,
            comments: [comment].concat(subtask.comments),
          }),
          taskIdentifier,
          task,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.DELETE_TASK_COMMENT_SUCCESS: {
      const { taskIdentifier, commentIdentifier } = action;

      const updateTaskFromAction = task => {
        if (task.taskIdentifier === taskIdentifier) {
          return {
            ...task,
            comments: task.comments?.filter(
              comment => comment.commentIdentifier !== commentIdentifier,
            ),
          };
        }

        return updateSubtasksInTaskWithCallback(
          subtask => ({
            ...subtask,
            comments: subtask.comments?.filter(
              comment => comment.commentIdentifier !== commentIdentifier,
            ),
          }),
          taskIdentifier,
          task,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier } = action;

      const updateTaskFromAction = task => {
        if (task.taskIdentifier === taskIdentifier) {
          return null;
        }

        if (task.subtasks?.length > 0) {
          const updatedSubtasks = task.subtasks?.filter(
            s => s.taskIdentifier !== taskIdentifier,
          );

          return {
            ...task,
            subtasks: updatedSubtasks,
            subTasksCount: updatedSubtasks?.length || task.subTasksCount,
          };
        }

        return task;
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.OPEN_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;

      const updateTaskFromAction = task =>
        task.taskIdentifier === taskIdentifier
          ? { ...task, subtaskQuickAddOpen: true }
          : task;

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.CLOSE_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;

      const updateTaskFromAction = task =>
        task.taskIdentifier === taskIdentifier
          ? { ...task, subtaskQuickAddOpen: false }
          : task;

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.TASK_ATTACHMENT_ADDED: {
      const { taskAttachment, taskIdentifier } = action;

      const updateTaskFromAction = task => {
        if (task.taskIdentifier === taskIdentifier) {
          return {
            ...task,
            attachments: [taskAttachment].concat(task.attachments),
          };
        }

        return updateSubtasksInTaskWithCallback(
          subtask => ({
            ...subtask,
            attachments: [taskAttachment].concat(subtask.attachments),
          }),
          taskIdentifier,
          task,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.TASK_ATTACHMENT_REMOVED: {
      const { taskAttachmentId, taskIdentifier } = action;

      const updateTaskFromAction = task => {
        if (task.taskIdentifier === taskIdentifier) {
          return {
            ...task,
            attachments: task.attachments?.filter(
              a => a.attachmentIdentifier !== taskAttachmentId,
            ),
          };
        }

        return updateSubtasksInTaskWithCallback(
          subtask => ({
            ...subtask,
            attachments: subtask.attachments?.filter(
              a => a.attachmentIdentifier !== taskAttachmentId,
            ),
          }),
          taskIdentifier,
          task,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.REQUEST_LOAD_SUBTASKS: {
      const {
        task: { taskIdentifier },
      } = action;

      const updateTaskFromAction = t =>
        t.taskIdentifier === taskIdentifier
          ? {
              ...t,
              isFetchingSubTasks: true,
            }
          : t;

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.LOAD_SUBTASKS_SUCCESS: {
      const { task } = action;

      const updateTaskFromAction = t =>
        t.taskIdentifier === task.taskIdentifier
          ? {
              ...t,
              ...task,
              isFetchingSubTasks: false,
            }
          : t;

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS:
    case ActionTypes.UPDATE_TASK_DETAILS_SUCCESS:
    case ActionTypes.UPDATE_TASK_SUCCESS:
    case ActionTypes.REFRESH_TASK_SUCCESS: {
      const { task } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === task.taskIdentifier) {
          return { ...t, ...task };
        }

        return updateNestedTask(task, task.taskIdentifier, t);
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_TASK_DUE_DATE:
    case ActionTypes.UPDATE_TASK_DUE_DATE_FAILURE: {
      const { task, dueDate } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === task.taskIdentifier) {
          return { ...t, dueDate };
        }

        return updateNestedTask({ dueDate }, task.taskIdentifier, t);
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.CHANGE_TASK_PRIORITY:
    case ActionTypes.CHANGE_TASK_PRIORITY_FAILURE: {
      const { task, priority } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === task.taskIdentifier) {
          return { ...t, priority };
        }

        return updateNestedTask({ priority }, task.taskIdentifier, t);
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.SET_COMPLETE_STATUS: {
      const { taskIdentifier, dataToUpdate } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === taskIdentifier) {
          if (dataToUpdate.status === TaskStatus.COMPLETE) {
            return {
              ...t,
              ...dataToUpdate,
              subtasks: t.subtasks?.map(s => ({
                ...s,
                ...dataToUpdate,
              })),
              subTasksCompletedCount: t.subTasksCount,
            };
          }

          return {
            ...t,
            ...dataToUpdate,
          };
        }

        if (t.subtasks?.length > 0 || t.taskDependencies?.length > 0) {
          let updatedTask = updateNestedTask(dataToUpdate, taskIdentifier, t);

          updatedTask = {
            ...updatedTask,
            dependencyTasksCompletedCount:
              updatedTask.taskDependencies?.filter(
                s => s.status === TaskStatus.COMPLETE,
              ).length || 0,
            subTasksCompletedCount:
              updatedTask.subtasks?.filter(
                s => s.status === TaskStatus.COMPLETE,
              ).length || 0,
          };
          return updatedTask;
        }

        return t;
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_TASK_COMMENT_SUCCESS: {
      const {
        task: { taskIdentifier },
        comment,
      } = action;

      const updateTaskFromAction = t => {
        function updateCommentIfMatches(commentIdentifier, comments) {
          return comments?.map(c =>
            c.commentIdentifier === commentIdentifier
              ? { ...c, ...comment }
              : c,
          );
        }

        if (t.taskIdentifier === taskIdentifier) {
          return {
            ...t,
            comments: updateCommentIfMatches(
              comment.commentIdentifier,
              t.comments,
            ),
          };
        }

        return updateSubtasksInTaskWithCallback(
          subtask => ({
            ...subtask,
            comments: updateCommentIfMatches(
              comment.commentIdentifier,
              subtask.comments,
            ),
          }),
          taskIdentifier,
          t,
        );
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_TASKS: {
      const {
        tasksToUpdate,
        fields: dataToUpdate,
        filters,
        searchValue,
      } = action;
      const updateTasksFromAction = task => {
        let updatedTask = task;

        if (tasksToUpdate.includes(task.taskIdentifier)) {
          updatedTask = {
            ...updatedTask,
            ...dataToUpdate,
          };

          if (dataToUpdate.patient) {
            updatedTask = {
              ...updatedTask,
              subtasks: updatedTask.subtasks?.map(s => ({
                ...s,
                patient: dataToUpdate.patient,
              })),
            };
          }

          if (dataToUpdate.status === TaskStatus.COMPLETE) {
            updatedTask = {
              ...updatedTask,
              subtasks: updatedTask.subtasks?.map(s => ({
                ...s,
                patient: dataToUpdate.status,
              })),
            };
          }
        }

        updatedTask = {
          ...updatedTask,
          subtasks: updatedTask.subtasks?.map(s =>
            tasksToUpdate.includes(s.taskIdentifier)
              ? { ...s, ...dataToUpdate }
              : s,
          ),
        };

        if (dataToUpdate.status && updatedTask.subtasks?.length > 0) {
          updatedTask = {
            ...updatedTask,
            subTasksCompletedCount: updatedTask.subtasks?.filter(
              ({ status }) => status === TaskStatus.COMPLETE,
            ).length,
          };
        }

        if (
          (!isEmpty(filters) &&
            !checkIfTaskMatchesFilters(updatedTask, filters)) ||
          (searchValue && !checkIfTaskMatchesSearch(updatedTask, searchValue))
        ) {
          return null;
        }

        return updatedTask;
      };
      return updateStateCallback(state, updateTasksFromAction);
    }

    case ActionTypes.DELETE_TASKS_SUCCESS: {
      const { tasksToDelete } = action;
      const updateTasksFromAction = task => {
        if (tasksToDelete.includes(task.taskIdentifier)) {
          return null;
        }

        if (task.subtasks?.length > 0) {
          const updatedSubtasks = task.subtasks?.filter(
            s => !tasksToDelete.includes(s.taskIdentifier),
          );

          return {
            ...task,
            subtasks: updatedSubtasks,
            subTasksCount: updatedSubtasks?.length,
          };
        }

        return task;
      };

      return updateStateCallback(state, updateTasksFromAction);
    }

    case ActionTypes.COMPLETE_TASKS_SUCCESS: {
      const { tasksToDelete } = action;
      const updateTasksFromAction = task => {
        if (tasksToDelete.includes(task.taskIdentifier)) {
          return null;
        }

        return task;
      };

      return updateStateCallback(state, updateTasksFromAction);
    }

    case ActionTypes.UNSELECT_ALL_TASKS: {
      const updateStateFromAction = task => {
        return {
          ...task,
          selected: false,
          subtasks: task.subtasks?.map(s => ({ ...s, selected: false })),
        };
      };

      return updateStateCallback(state, updateStateFromAction);
    }

    case ActionTypes.CHANGE_TASKS_SELECTED_STATE: {
      const { taskIdentifiers, newSelectedState } = action;

      const updateStateFromAction = task => {
        return {
          ...task,
          selected: taskIdentifiers.includes(task.taskIdentifier)
            ? newSelectedState
            : task.selected,

          subtasks: task.subtasks?.map(s =>
            taskIdentifiers.includes(s.taskIdentifier)
              ? { ...s, selected: newSelectedState }
              : s,
          ),
        };
      };

      return updateStateCallback(state, updateStateFromAction);
    }

    case ActionTypes.ADD_SUBTASK: {
      const { subtask } = action;
      const { parentTaskIdentifier } = subtask;

      const updateStateFromAction = task => {
        if (parentTaskIdentifier === task.taskIdentifier) {
          let updatedSubtasks = task.subtasks || [];
          updatedSubtasks = [...updatedSubtasks, subtask];

          return {
            ...task,
            subtasks: updatedSubtasks,
            subTasksCount: updatedSubtasks.length,
          };
        }

        return task;
      };

      return updateStateCallback(state, updateStateFromAction);
    }

    case ActionTypes.UPDATE_WORKFLOW_STATUS_FOR_TASKS: {
      const { statusIdentifier, dataToUpdate } = action;

      const updateStateFromAction = task => {
        if (task.workflowStatus?.identifier === statusIdentifier) {
          return {
            ...task,
            workflowStatus: {
              ...task.workflowStatus,
              ...dataToUpdate,
            },
          };
        }

        return task;
      };

      return updateStateCallback(state, updateStateFromAction);
    }

    case ActionTypes.CHANGE_TASK_INTENT_TYPE: {
      const { taskIdentifier, intentType } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === taskIdentifier) {
          return { ...t, intentType };
        }

        return t;
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.ADD_TASK_OUTCOME_SUCCESS: {
      const { taskIdentifier, outcome, link } = action;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === taskIdentifier) {
          let { taskLinks } = t;

          if (link) {
            taskLinks = taskLinks.map(l =>
              l.sourceTaskIdentifier === link.sourceTaskIdentifier &&
              l.targetTaskIdentifier === link.targetTaskIdentifier
                ? {
                    ...l,
                    decisionOutcome: outcome.taskOutcomeIdentifier,
                  }
                : l,
            );
          }

          return {
            ...t,
            taskOutcomes: [...t.taskOutcomes, outcome],
            taskLinks,
          };
        }

        return t;
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.LINK_TASKS_SUCCESS: {
      const { link } = action;
      const { sourceTaskIdentifier } = link;

      const updateTaskFromAction = t => {
        if (t.taskIdentifier === sourceTaskIdentifier) {
          return {
            ...t,
            taskLinks: [
              ...t.taskLinks.filter(
                l =>
                  !(
                    l.sourceTaskIdentifier === link.sourceTaskIdentifier &&
                    l.targetTaskIdentifier === link.targetTaskIdentifier
                  ),
              ),
              link,
            ],
          };
        }

        return t;
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    default:
      return state;
  }
};

export default TaskBaseReducer;
