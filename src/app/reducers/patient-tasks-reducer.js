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
  TASK_ARCHIVED,
  MOVE_TASK_SUCCESS,
  SORT_PATIENT_TASKS,
} from 'actions/action-types';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
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
  lists.map(list => {
    const updatedTasks = updateTaskCallback(list.tasks);
    return { ...list, tasks: updatedTasks };
  });

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    lists: updateTaskInList(state.lists, updateTaskFromAction),
  };
};

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
    case MOVE_TASK_SUCCESS: {
      const { task, taskList } = action;
      // remove task from existing tasklist
      const updatedState = TaskBaseReducer(
        state,
        action,
        updateTasksStateCallback,
      );
      // add task to new list
      updatedState.lists = updatedState.lists.map(list => {
        if (list.taskListIdentifier !== taskList.taskListIdentifier) {
          return list;
        }
        return { ...list, tasks: list.tasks.concat([task]) };
      });
      return updatedState;
    }
    case SET_PATIENT_TASK_SEARCH_VALUE:
      return {
        ...state,
        taskSearch: payload?.value,
      };

    case TASK_ARCHIVED:
      return state;

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

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
}
