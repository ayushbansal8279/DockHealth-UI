import {
  SET_ACTIVE_TAB,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  CLEAR_PATIENT_TASKS,
  TOGGLE_TASK_STATUS,
  INITIALIZE_PATIENT,
} from 'actions/action-types';

const INITIAL_STATE = {
  activeTab: null,
  patientIdentifier: null,
  lists: [],
  incompleteTasksCount: null,
  completeTasksCount: null,
  isFetching: false,
  error: false,
};

const updateTaskOrSubtask = (tasks, taskIdentifier, newTaskData) => {
  return tasks.map(task => {
    let updatedSubtasks = [];
    if (task.subtasks?.length > 0) {
      updatedSubtasks = updateTaskOrSubtask(
        task.subtasks,
        taskIdentifier,
        newTaskData,
      );
    }
    if (taskIdentifier === task.taskIdentifier) {
      return { ...task, subtasks: updatedSubtasks, ...newTaskData };
    }
    return { ...task, subtasks: updatedSubtasks };
  });
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
    case TOGGLE_TASK_STATUS: {
      const { newTaskData, taskIdentifier } = payload;

      const newTaskLists = state.lists.map(list => {
        const newTasks = updateTaskOrSubtask(
          list.tasks,
          taskIdentifier,
          newTaskData,
        );
        return { ...list, tasks: newTasks };
      });
      return {
        ...state,
        lists: newTaskLists,
      };
    }
    default:
      return state;
  }
}
