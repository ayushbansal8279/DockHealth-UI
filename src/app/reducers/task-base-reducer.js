/* eslint-disable sonarjs/cognitive-complexity */
// import isEmpty from 'ramda/src/isEmpty';
import * as ActionTypes from 'actions/action-types';
// import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
// import { checkIfTaskMatchesSearch } from 'helpers/search-helpers';
import {
  TaskStatus,
  updateNestedTask,
  updateSubtasksInTaskWithCallback,
} from 'helpers/task-helpers';
import { addArr, removeArr } from '../helpers/array-helpers';

const TaskBaseReducer = (state, action, updateStateCallback) => {
  switch (action.type) {
    case ActionTypes.UPDATE_PATIENT_DETAILS: {
      const {
        payload: { patientIdentifier, details },
      } = action;

      if (!state.tasksMap) {
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.patient?.patientIdentifier === patientIdentifier) {
          newMap[key] = {
            ...task,
            patient: { ...task.patient, ...details },
          };
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }
    case ActionTypes.ADD_TASK_COMMENT_SUCCESS: {
      const {
        task: { taskIdentifier },
        comment: { data: comment },
      } = action;

      if (!state.tasksMap) {
        if (state.selectedTask) {
          return {
            ...state,
            selectedTask: {
              ...state.selectedTask,
              comments: [comment].concat(state.selectedTask?.comments),
            },
          };
        }
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.taskIdentifier === taskIdentifier) {
          newMap[key] = {
            ...task,
            comments: [comment].concat(task.comments),
          };

          for (const subtask of task.subtasks) {
            newMap[subtask.identifier] = {
              ...newMap[subtask.identifier],
              comments: [comment].concat(subtask.comments),
            };
          }
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.DELETE_TASK_COMMENT_SUCCESS: {
      const { taskIdentifier, commentIdentifier } = action;

      if (!state.tasksMap) {
        if (state.selectedTask) {
          return {
            ...state,
            selectedTask: {
              ...state.selectedTask,
              comments: state.selectedTask?.comments?.filter(
                (comment) => comment.commentIdentifier !== commentIdentifier,
              ),
            },
          };
        }
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.taskIdentifier === taskIdentifier) {
          newMap[key] = {
            ...task,
            comments: task.comments?.filter(
              (comment) => comment.commentIdentifier !== commentIdentifier,
            ),
          };

          for (const subtask of task.subtasks) {
            newMap[subtask.identifier] = {
              ...newMap[subtask.identifier],
              comments: subtask.comments?.filter(
                (comment) => comment.commentIdentifier !== commentIdentifier,
              ),
            };
          }
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier } = action;

      const updateTaskFromAction = (tasksMap) => {
        const task = tasksMap[taskIdentifier];
        if (!task) {
          return null;
        }
        if (task.identifier === taskIdentifier) {
          // return null to remove the task
          return null;
        }

        if (task.subtasks?.length > 0) {
          const updatedSubtasks = task.subtasks?.filter(
            (s) => s.identifier !== taskIdentifier,
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

      return updateStateCallback(state, {
        identifier: taskIdentifier,
        subtaskQuickAddOpen: true,
      });
    }

    case ActionTypes.CLOSE_QUICK_ADD_SUBTASK_INPUT: {
      const { taskIdentifier } = action;

      return updateStateCallback(state, {
        identifier: taskIdentifier,
        subtaskQuickAddOpen: false,
      });
    }

    case ActionTypes.TASK_ATTACHMENT_ADDED: {
      const { taskAttachment, taskIdentifier } = action;

      if (!state.tasksMap) {
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.taskIdentifier === taskIdentifier) {
          newMap[key] = {
            ...task,
            attachments: [taskAttachment].concat(task.attachments),
          };

          for (const subtask of task.subtasks) {
            newMap[subtask.identifier] = {
              ...newMap[subtask.identifier],
              attachments: [taskAttachment].concat(subtask.attachments),
            };
          }
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.TASK_ATTACHMENT_REMOVED: {
      const { taskAttachmentId, taskIdentifier } = action;

      if (!state.tasksMap) {
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.taskIdentifier === taskIdentifier) {
          newMap[key] = {
            ...task,
            attachments: task.attachments?.filter(
              (a) => a.attachmentIdentifier !== taskAttachmentId,
            ),
          };

          for (const subtask of task.subtasks) {
            newMap[subtask.identifier] = {
              ...newMap[subtask.identifier],
              attachments: subtask.attachments?.filter(
                (a) => a.attachmentIdentifier !== taskAttachmentId,
              ),
            };
          }
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.REQUEST_LOAD_SUBTASKS: {
      const { task } = action;

      return updateStateCallback(state, {
        ...task,
        isFetchingSubTasks: true,
      });
    }

    case ActionTypes.LOAD_SUBTASKS_SUCCESS: {
      const { task } = action;

      return updateStateCallback(state, {
        ...task,
        isFetchingSubTasks: false,
      });
    }

    case ActionTypes.MARK_TASK_AS_READ_SUCCESS:
    case ActionTypes.MARK_TASK_AS_UNREAD_SUCCESS:
    case ActionTypes.UPDATE_TASK_DESCRIPTION_SUCCESS:
    case ActionTypes.UPDATE_TASK_DETAILS_SUCCESS:
    case ActionTypes.UPDATE_TASK_SUCCESS:
    case ActionTypes.REFRESH_TASK_SUCCESS: {
      const { task } = action;

      return updateStateCallback(state, {
        ...task,
      });
    }

    case ActionTypes.UPDATE_TASK_START_DATE:
    case ActionTypes.UPDATE_TASK_START_DATE_FAILURE: {
      const { task, startDate } = action;

      return updateStateCallback(state, {
        ...task,
        startDate,
      });
    }

    case ActionTypes.UPDATE_TASK_DUE_DATE:
    case ActionTypes.UPDATE_TASK_DUE_DATE_SUCCESS:
    case ActionTypes.UPDATE_TASK_DUE_DATE_FAILURE: {
      const { task, dueDate } = action;

      return updateStateCallback(state, {
        ...task,
        dueDate,
      });
    }

    case ActionTypes.CHANGE_TASK_PRIORITY:
    case ActionTypes.CHANGE_TASK_PRIORITY_FAILURE: {
      const { task, priority } = action;

      return updateStateCallback(state, {
        ...task,
        priority,
      });
    }

    case ActionTypes.SET_COMPLETE_STATUS: {
      const { taskIdentifier, dataToUpdate } = action;

      const updateTaskFromAction = (tasksMap) => {
        const t = tasksMap[taskIdentifier];
        if (!t) {
          return null;
        }
        if (t.identifier === taskIdentifier) {
          if (dataToUpdate.status === TaskStatus.INCOMPLETE) {
            return {
              ...t,
              ...dataToUpdate,
              subtasks: t.subtasks?.map((s) => ({
                ...s,
                ...dataToUpdate,
              })),
              subTasksCompletedCount: t.subTasksCount,
            };
          }

          if (t.subtasks?.length > 0 || t.taskDependencies?.length > 0) {
            let updatedTask = updateNestedTask(dataToUpdate, taskIdentifier, t);

            updatedTask = {
              ...updatedTask,
              dependencyTasksCompletedCount:
                updatedTask.taskDependencies?.filter(
                  (s) => s.status === TaskStatus.COMPLETE,
                ).length || 0,
              subTasksCompletedCount:
                updatedTask.subtasks?.filter(
                  (s) => s.status === TaskStatus.COMPLETE,
                ).length || 0,
            };
            return updatedTask;
          }
        }

        return {
          ...t,
          ...dataToUpdate,
        };
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_TASK_COMMENT_SUCCESS: {
      const {
        task: { taskIdentifier },
        comment,
      } = action;

      if (state.selectedTask) {
        return {
          ...state,
          selectedTask: {
            ...state.selectedTask,
            comments: state.selectedTask?.comments.map((c) =>
              c.commentIdentifier === comment.commentIdentifier ? comment : c,
            ),
          },
        };
      }

      const updateTaskFromAction = (tasksMap) => {
        const t = tasksMap[taskIdentifier];
        if (!t) {
          return null;
        }
        // eslint-disable-next-line unicorn/consistent-function-scoping
        function updateCommentIfMatches(commentIdentifier, comments) {
          return comments?.map((c) =>
            c.commentIdentifier === commentIdentifier
              ? { ...c, ...comment }
              : c,
          );
        }

        if (t.identifier === taskIdentifier) {
          return {
            ...t,
            comments: updateCommentIfMatches(
              comment.commentIdentifier,
              t.comments,
            ),
          };
        }

        return updateSubtasksInTaskWithCallback(
          (subtask) => ({
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
      const { tasksToUpdate, fields: dataToUpdate } = action;
      let updatedState = state;
      for (const taskId of tasksToUpdate) {
        updatedState = updateStateCallback(updatedState, (tasksMap) => {
          return {
            ...tasksMap[taskId],
            ...dataToUpdate,
          };
        });
      }
      return updatedState;
    }

    case ActionTypes.DO_ASSIGNMENT: {
      const { tasksToUpdate, users } = action;
      let updatedState = state;
      for (const taskId of tasksToUpdate) {
        updatedState = updateStateCallback(updatedState, (tasksMap) => {
          return {
            ...tasksMap[taskId],
            assignedToUsers: addArr(
              tasksMap[taskId].assignedToUsers,
              users,
              'userIdentifier',
            ),
          };
        });
      }
      return updatedState;
    }

    case ActionTypes.DO_UNASSIGNMENT: {
      const { tasksToUpdate, users } = action;
      let updatedState = state;
      for (const taskId of tasksToUpdate) {
        updatedState = updateStateCallback(updatedState, (tasksMap) => {
          return {
            ...tasksMap[taskId],
            assignedToUsers: removeArr(
              tasksMap[taskId].assignedToUsers,
              users,
              'userIdentifier',
            ),
          };
        });
      }
      return updatedState;
    }

    case ActionTypes.DO_UNASSIGN_ALL: {
      const { tasksToUpdate } = action;
      let updatedState = state;
      for (const taskId of tasksToUpdate) {
        updatedState = updateStateCallback(updatedState, (tasksMap) => {
          return {
            ...tasksMap[taskId],
            assignedToUsers: [],
          };
        });
      }
      return updatedState;
    }

    case ActionTypes.DELETE_TASKS_SUCCESS: {
      const { tasksToDelete } = action;
      const updateTasksFromAction = (task) => {
        if (tasksToDelete.includes(task.taskIdentifier)) {
          return null;
        }

        if (task.subtasks?.length > 0) {
          const updatedSubtasks = task.subtasks?.filter(
            (s) => !tasksToDelete.includes(s.taskIdentifier),
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
      const updateTasksFromAction = (task) => {
        if (tasksToDelete.includes(task.taskIdentifier)) {
          return null;
        }

        return task;
      };

      return updateStateCallback(state, updateTasksFromAction);
    }

    case ActionTypes.ADD_SUBTASK: {
      const { subtask, parentTaskIdentifier } = action;

      const updateTaskFromAction = (tasksMap) => {
        const task = tasksMap[parentTaskIdentifier];
        if (!task) {
          return null;
        }

        return {
          ...task,
          subtasks: task.subtasks?.map((s) => ({
            ...s,
            subtask,
          })),
          subTasksCount: task?.subTasksCount + 1,
        };
      };

      return updateStateCallback(state, updateTaskFromAction);
    }

    case ActionTypes.UPDATE_WORKFLOW_STATUS_FOR_TASKS: {
      const { statusIdentifier, dataToUpdate } = action;

      if (!state.tasksMap) {
        return state;
      }

      const newMap = { ...state.tasksMap };
      for (const [key, task] of Object.entries(newMap)) {
        if (task.workflowStatus?.identifier === statusIdentifier) {
          newMap[key] = {
            ...task,
            workflowStatus: {
              ...task.workflowStatus,
              ...dataToUpdate,
            },
          };
        }
      }

      return {
        ...state,
        tasksMap: newMap,
      };
    }

    case ActionTypes.CHANGE_TASK_INTENT_TYPE: {
      const { taskIdentifier, intentType } = action;

      return updateStateCallback(state, {
        identifier: taskIdentifier,
        intentType,
      });
    }

    case ActionTypes.ADD_TASK_OUTCOME_SUCCESS: {
      const { taskIdentifier, outcome, link } = action;

      const updateTaskFromAction = (tasksMap) => {
        const t = tasksMap[taskIdentifier];
        if (!t) {
          return null;
        }
        if (t.identifier === taskIdentifier) {
          let { taskLinks } = t;

          if (link) {
            taskLinks = taskLinks.map((l) =>
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

      const updateTaskFromAction = (tasksMap) => {
        const t = tasksMap[sourceTaskIdentifier];
        if (!t) {
          return null;
        }
        if (t.identifier === sourceTaskIdentifier) {
          return {
            ...t,
            taskLinks: [
              ...t.taskLinks.filter(
                (l) =>
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

    case ActionTypes.FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_SUCCESS: {
      // const newMap = { ...state.tasksMap };
      // for (const task of action.payload.flatMap((taskList) => taskList.tasks)) {
      //   newMap[task.identifier] = task;
      // }
      //
      // console.log(
      //   '!!! FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_SUCCESS',
      //   action,
      //   state,
      //   state.tasksMap,
      //   action.payload.flatMap((taskList) => taskList.tasks),
      //   newMap,
      // );
      //
      // return {
      //   ...state,
      //   tasks: [...(state.tasks || []), ...action.payload],
      //   taskMap2: newMap,
      // };

      return { dupa: 1 };
    }

    default: {
      return state;
    }
  }
};

export default TaskBaseReducer;
