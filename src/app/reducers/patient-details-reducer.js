/* eslint-disable sonarjs/max-switch-cases */
import * as ActionTypes from 'actions/action-types';
import { TaskGroupType, TaskItemType, TaskStatus } from 'helpers/task-helpers';
import { reorderTasksForWorkflow } from 'helpers/workflow-helpers';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
import { updateBundleInList } from 'helpers/tasklist-helpers';
import { updateTasksStateCallback, updateTasksMap } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const INITIAL_STATE = {
  patientIdentifier: null,
  patient: null,
  currentFolderIdentifier: null,
  attachments: null,
  isFetchingPatient: false,
  labels: null,
  isFetchingLabels: false,
  completeTasksVisible: false,
  currentTasksStatus: TaskStatus.INCOMPLETE,
  lists: null,
  tasksMap: {},
  taskSearch: null,
  incompleteTasksCount: null,
  completeTasksCount: null,
  isFetching: false,
  error: false,
  sort: {
    key: null,
    order: null,
  },
};

function updateWorkflowInState(workflowIdentifier, updatedData, state) {
  const updatedMap = {
    [workflowIdentifier]: {
      ...state.tasksMap[workflowIdentifier],
      ...updatedData,
      tasks: updatedData?.tasks.map((task) => task.identifier),
    },
  };

  // add tasks and subtasks in the bundle
  for (const task of updatedData?.tasks) {
    updatedMap[task.identifier] = {
      ...updatedMap[task.identifier],
      ...task,
    };
    for (const subtask of task?.subtasks) {
      updatedMap[subtask.identifier] = {
        ...updatedMap[subtask.identifier],
        ...subtask,
      };
    }
  }

  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      ...updatedMap,
    },
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default (state = INITIAL_STATE, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      return updateWorkflowInState(
        action.taskWorkflowIdentifier,
        action.newData,
        state,
      );
    }

    case ActionTypes.INITIALIZE_PATIENT_STATE: {
      return {
        ...state,
        patientIdentifier: action.patientIdentifier,
      };
    }

    case ActionTypes.UPDATE_LIST_PREFERENCES: {
      const {
        currentUserIdentifier,
        setup: { listDisplayColumns },
        taskListIdentifier,
      } = action.payload;
      return {
        ...state,
        lists: state.lists?.map((l) => {
          if (l?.listType === 'PUBLIC') {
            return l.taskListIdentifier === taskListIdentifier
              ? {
                  ...l,
                  listDisplayColumns,
                }
              : l;
          }
          return l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                listUsers: l.listUsers.map((u) =>
                  u.identifier === currentUserIdentifier
                    ? { ...u, listDisplayColumns }
                    : u,
                ),
              }
            : l;
        }),
      };
    }

    case ActionTypes.CLEAR_PATIENT_STATE: {
      return {
        ...INITIAL_STATE,
      };
    }

    case ActionTypes.INITIALIZE_PATIENT_ATTACHMENTS_FOLDER: {
      return {
        ...state,
        currentFolderIdentifier: action.folderIdentifier,
      };
    }

    case ActionTypes.CLEAR_PATIENT_ATTACHMENTS_FOLDER: {
      return {
        ...state,
        currentFolderIdentifier: null,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENT: {
      return { ...state, isFetchingPatient: true };
    }

    case ActionTypes.GET_CURRENT_PATIENT_SUCCESS: {
      return { ...state, patient: action.patient, isFetchingPatient: false };
    }

    case ActionTypes.GET_CURRENT_PATIENT_FAILURE: {
      return { ...state, patient: null, isFetchingPatient: false };
    }

    case ActionTypes.GET_CURRENT_PATIENT_LABELS: {
      return { ...state, isFetchingLabels: true };
    }

    case ActionTypes.GET_CURRENT_PATIENT_LABELS_SUCCESS: {
      return { ...state, labels: action.labels, isFetchingLabels: false };
    }

    case ActionTypes.GET_CURRENT_PATIENT_LABELS_FAILURE: {
      return { ...state, labels: null, isFetchingLabels: false };
    }

    case ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS: {
      return { ...state, isFetchingAttachments: true };
    }

    case ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS_SUCCESS: {
      return {
        ...state,
        attachments: action.attachments,
        isFetchingAttachments: false,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS_FAILURE: {
      return {
        ...state,
        attachments: null,
        isFetchingAttachments: false,
      };
    }

    case ActionTypes.ADD_PATIENT_ATTACHMENT_FOLDER_SUCCESS: {
      return {
        ...state,
        attachments: [...(state.attachments || []), action.folder],
      };
    }

    case ActionTypes.UPDATE_PATIENT_ATTACHMENT_SUCCESS: {
      const { attachment: updatedAttachment } = action;

      return {
        ...state,
        attachments:
          state.attachments?.map((a) =>
            a.attachmentIdentifier === updatedAttachment.attachmentIdentifier
              ? { ...a, ...updatedAttachment }
              : a,
          ) ?? null,
      };
    }

    case ActionTypes.MOVE_PATIENT_ATTACHMENT_SUCCESS: {
      const { attachment: movedAttachment } = action;

      return {
        ...state,
        attachments:
          state.attachments?.filter(
            ({ attachmentIdentifier }) =>
              attachmentIdentifier !== movedAttachment.attachmentIdentifier,
          ) ?? null,
      };
    }

    case ActionTypes.ADD_PATIENT_ATTACHMENT_SUCCESS:
    case ActionTypes.ADD_PATIENT_ATTACHMENT_REFERENCE_SUCCESS: {
      return {
        ...state,
        attachments: [...(state.attachments || []), action.attachment],
      };
    }

    case ActionTypes.DELETE_PATIENT_ATTACHMENT: {
      const { identifier } = action;
      return {
        ...state,
        attachments:
          state.attachments?.filter(
            ({ attachmentIdentifier }) => attachmentIdentifier !== identifier,
          ) || null,
      };
    }

    case ActionTypes.TOGGLE_PATIENT_COMPLETE_TASKS_VISIBLE: {
      return {
        ...state,
        completeTasksVisible: !state.completeTasksVisible,
      };
    }

    case ActionTypes.SELECT_PATIENT_LIST_TASK_STATUS: {
      return {
        ...state,
        currentTasksStatus: action.taskStatus,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENT_TASKS: {
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENT_TASKS_SUCCESS: {
      const { lists } = action;
      const newMap = {};
      for (const list of lists) {
        for (const taskItem of list?.tasks) {
          if (taskItem.itemType === TaskItemType.TASK) {
            newMap[taskItem.identifier] = taskItem;
            for (const subtask of taskItem?.subtasks) {
              newMap[subtask.identifier] = {
                ...newMap[subtask.identifier],
                ...subtask,
              };
            }
          } else {
            for (const grpTask of taskItem.tasks) {
              newMap[grpTask.identifier] = grpTask;
              // for (const subtask of grpTask?.subtasks) {
              //   newMap[subtask.identifier] = {
              //     ...newMap[subtask.identifier],
              //     ...subtask,
              //   };
              // }
            }
            // newMap[task.identifier] = task;
            newMap[taskItem.identifier] = {
              ...taskItem,
              tasks: taskItem.tasks.map((t) => t.identifier),
            };
          }
        }
      }

      return {
        ...state,
        lists: action.lists,
        // lists: action.lists?.map((l) => ({
        //   ...l,
        //   tasks: l.tasks?.lists?.map((t) => ({
        //     ...t,
        //     tasks:
        //       t.itemType === 'BUNDLE'
        //         ? t.tasks?.map((task) => task.identifier)
        //         : [],
        //   })),
        // })),
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
        isFetching: false,
      };
    }

    case ActionTypes.GET_CURRENT_PATIENT_TASKS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    }

    case ActionTypes.GET_PATIENT_TASKS_STATS_SUCCESS: {
      return {
        ...state,
        incompleteTasksCount: payload?.incompleteTasksCount,
        completeTasksCount: payload?.completeTasksCount,
      };
    }

    case ActionTypes.GET_PATIENT_TASKS_STATS_FAILURE: {
      return {
        ...state,
        incompleteTasksCount: null,
        completeTasksCount: null,
      };
    }

    case ActionTypes.UPDATE_PATIENT_TASK: {
      const { newTaskData, taskIdentifier } = payload;
      return {
        ...state,
        lists: updateTaskOrSubtaskInListsArray(
          state.lists,
          newTaskData,
          taskIdentifier,
        ),
      };
    }

    case ActionTypes.SET_PATIENT_TASK_SEARCH_VALUE: {
      return {
        ...state,
        taskSearch: payload?.value,
      };
    }

    case ActionTypes.SORT_PATIENT_TASKS: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    case ActionTypes.UPDATE_TEMPLATE_BUNDLE_FAILURE:
    case ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS: {
      const { bundleIdentifier, dataToUpdate } = action;

      const updatedMap = updateTasksMap(state, {
        itemType: TaskItemType.BUNDLE,
        identifier: bundleIdentifier,
        ...dataToUpdate,
      });

      const newMap = {
        ...state.tasksMap,
        ...updatedMap,
      };

      // eslint-disable-next-line sonarjs/prefer-immediate-return
      const updatedState = {
        ...state,
        lists: state.lists?.map((l) => {
          return l?.taskListIdentifier === dataToUpdate?.taskListIdentifier
            ? {
                ...l,
                tasks: updateBundleInList(
                  dataToUpdate,
                  dataToUpdate.identifier,
                  l.tasks,
                ),
              }
            : { ...l };
        }),
        tasksMap: newMap,
      };

      return updatedState;
    }

    case ActionTypes.REORDER_WORKFLOW_TASKS: {
      const {
        source: { index: sourceIndex },
        destination: { index: destinationIndex },
        workflow,
        completedTasksShown,
        incompleteTasksShown,
      } = action;

      const reorderedTasks = reorderTasksForWorkflow(
        sourceIndex,
        destinationIndex,
        incompleteTasksShown,
        completedTasksShown,
        workflow.tasks,
      );

      return {
        ...state,
        lists: state.lists?.map((l) => ({
          ...l,
          tasks: updateBundleInList(
            { tasks: reorderedTasks },
            workflow.identifier,
            l.tasks,
          ),
        })),
      };
    }

    case ActionTypes.REORDER_WORKFLOW_TASKS_FAILURE: {
      const { workflow } = action;

      return {
        ...state,
        lists: state.lists?.map((l) => ({
          ...l,
          tasks: updateBundleInList(
            { tasks: workflow.tasks },
            workflow.identifier,
            l.tasks,
          ),
        })),
      };
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const bundleIdentifier = addedTask?.taskGroups?.find(
        ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      )?.taskGroupIdentifier;

      const { taskListIdentifier } = addedTask?.taskList || {};
      const updatedState = bundleIdentifier
        ? {
            ...state,
            lists: state.lists?.map((l) => ({
              ...l,
              tasks: l.tasks?.map((t) =>
                t.identifier === bundleIdentifier
                  ? { ...t, tasks: [...(t.tasks || []), addedTask] }
                  : t,
              ),
            })),
            tasksMap: {
              ...state.tasksMap,
              [bundleIdentifier]: {
                ...state.tasksMap[bundleIdentifier],
                tasks: [
                  ...(state.tasksMap[bundleIdentifier]?.tasks || []),
                  addedTask?.taskIdentifier,
                ],
              },
            },
          }
        : {
            ...state,
            lists: state.lists?.map((l) =>
              l.taskListIdentifier === taskListIdentifier
                ? {
                    ...l,
                    tasks: [addedTask, ...(l.tasks || [])],
                  }
                : l,
            ),
          };

      return updateTasksStateCallback(updatedState, addedTask);
    }

    case ActionTypes.GET_TASKS_FOR_WORKFLOW: {
      const { workflowIdentifier } = action;

      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          [workflowIdentifier]: {
            ...state.tasksMap[workflowIdentifier],
          },
        },
      };
    }

    case ActionTypes.GET_TASKS_FOR_WORKFLOW_SUCCESS: {
      const { workflowIdentifier, tasks } = action;

      const updatedMap = updateTasksMap(state, {
        identifier: workflowIdentifier,
        itemType: TaskItemType.BUNDLE,
        tasks,
      });

      return {
        ...state,
        tasksMap: {
          ...state.tasksMap,
          ...updatedMap,
          [workflowIdentifier]: {
            ...state.tasksMap[workflowIdentifier],
            tasks: tasks.map((task) => task.identifier),
          },
        },
      };
    }

    case ActionTypes.ADD_TEMPLATE_BUNDLE: {
      const { bundle: addedBundle } = action;

      const { taskListIdentifier } = addedBundle;

      return {
        ...state,
        lists: state.lists?.map((l) =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [addedBundle, ...(l.tasks || [])],
              }
            : l,
        ),
      };
    }

    case ActionTypes.DUPLICATE_WORKFLOW_SUCCESS: {
      const { workflow } = action;

      const { taskListIdentifier } = workflow;

      return {
        ...state,
        lists: state.lists?.map((l) =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [workflow, ...(l.tasks || [])],
              }
            : l,
        ),
      };
    }

    case ActionTypes.COMPLETE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier } = action;

      return {
        ...state,
        lists: state.lists?.map((l) => ({
          ...l,
          tasks: l.tasks?.filter(
            ({ identifier }) => identifier !== bundleIdentifier,
          ),
        })),
      };
    }

    case ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST_SUCCESS:
    case ActionTypes.DELETE_WORKFLOW: {
      const { identifier } = action;

      return {
        ...state,
        lists: state.lists?.map((l) => ({
          ...l,
          tasks: l.tasks?.filter(({ identifier: id }) => id !== identifier),
        })),
      };
    }

    case ActionTypes.UPDATE_PATIENT_NOTE: {
      const { patientNoteIdentifier, note: noteToUpdate } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: state.patient.allNotes.map((note) =>
            note.patientNoteIdentifier === patientNoteIdentifier
              ? { ...note, ...noteToUpdate }
              : note,
          ),
        },
      };
    }

    case ActionTypes.UPDATE_PATIENT_DETAILS_SUCCESS: {
      const { details } = payload;
      return {
        ...state,
        patient: {
          ...state.patient,
          ...details,
        },
      };
    }

    case ActionTypes.ADD_PATIENT_NOTE: {
      const { note } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: [note, ...state.patient.allNotes],
        },
      };
    }

    case ActionTypes.REMOVE_PATIENT_NOTE: {
      const { patientNoteIdentifier } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: state.patient.allNotes.filter(
            (note) => note.patientNoteIdentifier !== patientNoteIdentifier,
          ),
        },
      };
    }

    case ActionTypes.PIN_PATIENT_NOTE: {
      const { patientNoteIdentifier } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: state.patient.allNotes.map((note) =>
            note.patientNoteIdentifier === patientNoteIdentifier
              ? { ...note, pinned: true }
              : note,
          ),
        },
      };
    }

    case ActionTypes.UNPIN_PATIENT_NOTE: {
      const { patientNoteIdentifier } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: state.patient.allNotes.map((note) =>
            note.patientNoteIdentifier === patientNoteIdentifier
              ? { ...note, pinned: false }
              : note,
          ),
        },
      };
    }

    case ActionTypes.INSERT_CREATED_TASK_SUCCESS: {
      const { task } = action;
      const { parentTaskIdentifier, patient, taskList } = task;
      const currentPatientIdentifier = state.patientIdentifier;

      if (
        !currentPatientIdentifier ||
        patient?.patientIdentifier !== currentPatientIdentifier ||
        !!parentTaskIdentifier
      ) {
        return { ...state };
      }
      const bundleIdentifier = task.taskGroups?.find(
        ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      )?.taskGroupIdentifier;

      const updatedState = bundleIdentifier
        ? {
            ...state,
          }
        : {
            ...state,
            lists: state.lists?.map((l) => {
              if (
                l.taskListIdentifier === taskList.taskListIdentifier &&
                !l.tasks?.some(
                  ({ taskIdentifier }) =>
                    taskIdentifier === task.taskIdentifier,
                )
              ) {
                return { ...l, tasks: [task, ...(l.tasks || [])] };
              }
              return l;
            }),
          };

      return updateTasksStateCallback(updatedState, task);
    }

    case ActionTypes.APPLY_TEMPLATE_SUCCESS: {
      const { template, taskListIdentifier } = action;
      const updatedState = {
        ...state,
        lists: state.lists?.map((l) =>
          taskListIdentifier === l.taskListIdentifier
            ? {
                ...l,
                tasks: [template, ...(l.tasks || [])],
              }
            : l,
        ),
      };

      const updatedMap = updateTasksMap(updatedState, template);
      return {
        ...updatedState,
        tasksMap: {
          ...state.tasksMap,
          ...updatedMap,
        },
      };
    }

    case ActionTypes.PATIENT_ADD_LABEL_SUCCESS: {
      return {
        ...state,
        patient: {
          ...state.patient,
          patientLabels: [...(state.patient.patientLabels ?? []), action.label],
        },
      };
    }

    case ActionTypes.PATIENT_DELETE_LABEL_SUCCESS: {
      return {
        ...state,
        patient: {
          ...state.patient,
          patientLabels: state.patient.patientLabels.filter(
            (l) => l.labelIdentifier !== action.deletedLabelIdentifier,
          ),
        },
      };
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier } = action;
      const taskItem = state.tasksMap[taskIdentifier];

      const { taskListIdentifier } = taskItem?.taskList || {};

      const bundle =
        taskItem?.taskGroups?.find(
          ({ groupType }) => groupType === TaskGroupType.BUNDLE,
        ) || {};
      const bundleIdentifier = bundle?.taskGroupIdentifier;

      const updatedStateAfterRemovingTaskItem =
        taskItem?.itemType === TaskItemType.BUNDLE
          ? { ...state }
          : {
              ...state,
              tasksMap:
                bundleIdentifier && !taskItem?.parentTaskIdentifier
                  ? {
                      ...state.tasksMap,
                      [bundleIdentifier]: {
                        ...state.tasksMap[bundleIdentifier],
                        tasks: state.tasksMap[bundleIdentifier]?.tasks?.filter(
                          (taskId) => taskId !== taskIdentifier,
                        ),
                      },
                    }
                  : state.tasksMap,
              lists: state.lists?.map((l) =>
                l.taskListIdentifier === taskListIdentifier
                  ? {
                      ...l,
                      tasks:
                        bundleIdentifier && !taskItem?.parentTaskIdentifier
                          ? state.tasksMap[bundleIdentifier]?.tasks.length === 1
                            ? l.tasks?.filter(
                                (task) => task.identifier !== bundleIdentifier,
                              )
                            : l.tasks
                          : l.tasks?.filter(
                              (task) => task?.taskIdentifier !== taskIdentifier,
                            ),
                    }
                  : l,
              ),
            };

      return state.patientIdentifier && state.patientIdentifier !== ''
        ? TaskBaseReducer(
            updatedStateAfterRemovingTaskItem,
            action,
            updateTasksStateCallback,
          )
        : state;
    }

    default: {
      return state.patientIdentifier && state.patientIdentifier !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};
