import * as ActionTypes from 'actions/action-types';
import { TaskGroupType, TaskItemType } from 'helpers/task-helpers';
import { mapWithRemove } from 'helpers/utility-functions';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
import { updateBundleInList } from 'helpers/tasklist-helpers';
import TaskBaseReducer from './task-base-reducer';

const INITIAL_STATE = {
  patientIdentifier: null,
  patient: null,
  isFetchingPatient: false,
  labels: null,
  isFetchingLabels: false,
  completeTasksVisible: false,
  lists: [],
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

const updateTaskInList = (lists, updateTaskCallback) =>
  lists.map(list => ({
    ...list,
    tasks: mapWithRemove(t => {
      if (t.itemType === TaskItemType.BUNDLE) {
        return {
          ...t,
          tasks: mapWithRemove(updateTaskCallback, t.tasks),
        };
      }

      return updateTaskCallback(t);
    }, list.tasks),
  }));

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    lists: updateTaskInList(state.lists, updateTaskFromAction),
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function(state = INITIAL_STATE, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.INITIALIZE_PATIENT_STATE: {
      return {
        ...state,
        patientIdentifier: action.patientIdentifier,
      };
    }

    case ActionTypes.CLEAR_PATIENT_STATE:
      return {
        ...INITIAL_STATE,
      };

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

    case ActionTypes.SET_PATIENT_ATTACHMENTS_FETCHING: {
      return { ...state, attachments: null, isFetchingAttachments: true };
    }

    case ActionTypes.SET_PATIENT_ATTACHMENTS: {
      return {
        ...state,
        attachments: payload.attachments,
        isFetchingAttachments: false,
      };
    }

    case ActionTypes.TOGGLE_PATIENT_COMPLETE_TASKS_VISIBLE:
      return {
        ...state,
        completeTasksVisible: !state.completeTasksVisible,
      };

    case ActionTypes.GET_PATIENT_TASKS:
      return {
        ...state,
        isFetching: action.withLoader,
        error: false,
      };

    case ActionTypes.GET_PATIENT_TASKS_SUCCESS:
      return {
        ...state,
        lists: action.lists,
        isFetching: false,
      };

    case ActionTypes.GET_PATIENT_TASKS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };

    case ActionTypes.GET_PATIENT_TASKS_STATS_SUCCESS:
      return {
        ...state,
        incompleteTasksCount: payload?.incompleteTasksCount,
        completeTasksCount: payload?.completeTasksCount,
      };

    case ActionTypes.GET_PATIENT_TASKS_STATS_FAILURE:
      return {
        ...state,
        incompleteTasksCount: null,
        completeTasksCount: null,
      };

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

    case ActionTypes.SET_PATIENT_TASK_SEARCH_VALUE:
      return {
        ...state,
        taskSearch: payload?.value,
      };

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

      return {
        ...state,
        lists: state.lists?.map(l => ({
          ...l,
          tasks: updateBundleInList(dataToUpdate, bundleIdentifier, l.tasks),
        })),
      };
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;

      const bundleIdentifier = addedTask.taskGroups?.find(
        ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      )?.taskGroupIdentifier;

      if (bundleIdentifier) {
        return {
          ...state,
          lists: state.lists?.map(l => ({
            ...l,
            tasks: l.tasks?.map(t =>
              t.identifier === bundleIdentifier
                ? { ...t, tasks: [...(t.tasks || []), addedTask] }
                : t,
            ),
          })),
        };
      }

      const { taskListIdentifier } = addedTask.taskList || {};

      return {
        ...state,
        lists: state.lists?.map(l =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [addedTask, ...(l.tasks || [])],
              }
            : l,
        ),
      };
    }

    case ActionTypes.ADD_TEMPLATE_BUNDLE: {
      const { bundle: addedBundle } = action;

      const { taskListIdentifier } = addedBundle;

      return {
        ...state,
        lists: state.lists?.map(l =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [addedBundle, ...(l.tasks || [])],
              }
            : l,
        ),
      };
    }

    case ActionTypes.MOVE_TEMPLATE_BUNDLE_SUCCESS:
    case ActionTypes.DELETE_TEMPLATE_BUNDLE:
    case ActionTypes.COMPLETE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier } = action;

      return {
        ...state,
        lists: state.lists?.map(l => ({
          ...l,
          tasks: l.tasks?.filter(
            ({ identifier }) => identifier !== bundleIdentifier,
          ),
        })),
      };
    }

    case ActionTypes.UPDATE_PATIENT_NOTE: {
      const { patientNoteIdentifier, note: noteToUpdate } = payload;

      return {
        ...state,
        patient: {
          ...state.patient,
          allNotes: state.patient.allNotes.map(note =>
            note.patientNoteIdentifier === patientNoteIdentifier
              ? { ...note, ...noteToUpdate }
              : note,
          ),
        },
      };
    }

    case ActionTypes.UPDATE_PATIENT_DETAILS: {
      const { details } = payload;
      return {
        ...state,
        patient: { ...state.patient, ...details },
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
            note => note.patientNoteIdentifier !== patientNoteIdentifier,
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
          allNotes: state.patient.allNotes.map(note =>
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
          allNotes: state.patient.allNotes.map(note =>
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

      return {
        ...state,
        lists: state.lists?.map(l => {
          if (
            l.taskListIdentifier === taskList.taskListIdentifier &&
            !l.tasks?.some(
              ({ taskIdentifier }) => taskIdentifier === task.taskIdentifier,
            )
          ) {
            return { ...l, tasks: [task, ...(l.tasks || [])] };
          }

          return l;
        }),
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
}
