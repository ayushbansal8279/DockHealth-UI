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
  MARK_TASK_STATUS_SUCCESS,
  MARK_COMPLETE_TASK_STATUS_SUCCESS,
  TASK_ARCHIVED,
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
    case SET_PATIENT_TASK_SEARCH_VALUE:
      return {
        ...state,
        taskSearch: payload?.value,
      };

    case MARK_TASK_STATUS_SUCCESS:
    case MARK_COMPLETE_TASK_STATUS_SUCCESS:
    case TASK_ARCHIVED:
      return state;

    default:
      return TaskBaseReducer(
        state,
        action,
        'patient',
        updateTasksStateCallback,
      );
  }
}
