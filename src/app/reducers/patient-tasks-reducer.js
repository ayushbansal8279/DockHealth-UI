import {
  SET_ACTIVE_TAB,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  CLEAR_PATIENT_TASKS,
  UPDATE_PATIENT_TASK,
  INITIALIZE_PATIENT,
  SET_PATIENT_TASK_SEARCH_VALUE,
  SORT_PATIENT_TASKS,
  UPDATE_TEMPLATE_BUNDLE,
  ADD_TASK,
  ADD_TEMPLATE_BUNDLE,
  DELETE_TEMPLATE_BUNDLE,
} from 'actions/action-types';
import { TaskGroupType, TaskItemType } from 'helpers/task-helpers';
import { mapWithRemove } from 'helpers/utility-functions';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
import { updateBundleInList } from 'helpers/tasklist-helpers';
import TaskBaseReducer from './task-base-reducer';

const INITIAL_STATE = {
  activeTab: null,
  patientIdentifier: null,
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
    case CLEAR_PATIENT_TASKS:
      return {
        ...INITIAL_STATE,
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload?.activeTab,
      };
    case INITIALIZE_PATIENT:
      return {
        ...state,
        patientIdentifier: payload?.patientIdentifier,
      };
    case REQUEST_PATIENT_TASKS:
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case REQUEST_PATIENT_TASKS_SUCCESS:
      return {
        ...state,
        lists: payload?.lists,
        isFetching: false,
      };
    case REQUEST_PATIENT_TASKS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case REQUEST_PATIENT_STATS_SUCCESS:
      return {
        ...state,
        incompleteTasksCount: payload?.incompleteTasksCount,
        completeTasksCount: payload?.completeTasksCount,
      };
    case REQUEST_PATIENT_STATS_FAILURE:
      return {
        ...state,
        incompleteTasksCount: null,
        completeTasksCount: null,
      };
    case UPDATE_PATIENT_TASK: {
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

    case SET_PATIENT_TASK_SEARCH_VALUE:
      return {
        ...state,
        taskSearch: payload?.value,
      };

    case SORT_PATIENT_TASKS: {
      const { key, order } = action.payload || {};

      return {
        ...state,
        sort: {
          key,
          order,
        },
      };
    }

    case UPDATE_TEMPLATE_BUNDLE: {
      const { bundleIdentifier, dataToUpdate } = action;

      return {
        ...state,
        lists: state.lists?.map(l => ({
          ...l,
          tasks: updateBundleInList(dataToUpdate, bundleIdentifier, l.tasks),
        })),
      };
    }

    case ADD_TASK: {
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

    case ADD_TEMPLATE_BUNDLE: {
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

    case DELETE_TEMPLATE_BUNDLE: {
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

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
}
