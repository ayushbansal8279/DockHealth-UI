import * as ActionTypes from 'actions/action-types';
import { mapWithRemove } from 'helpers/utility-functions';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tabName: null,
  tasksList: [],
  isLoading: false,
  error: '',
};

const updateTaskInList = (lists, updateTaskCallback) =>
  lists.map(group => {
    const updatedTasks = group.tasks
      ? mapWithRemove(updateTaskCallback, group.tasks)
      : [];
    return { ...group, tasks: updatedTasks };
  });

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    tasksList: updateTaskInList(state.tasksList, updateTaskFromAction),
  };
};

const DashboardTasksReducer = (state = initialState, action) => {
  const { type, tasksList, error } = action;
  switch (type) {
    case ActionTypes.INITIALIZE_DASHBOARD_STATE:
      return {
        ...state,
        ...initialState,
        tabName: action.tabName,
      };

    case ActionTypes.CLEAR_DASHBOARD_STATE:
      return {
        ...initialState,
      };

    case ActionTypes.GET_DASHBOARD_GROUPS:
    case ActionTypes.SEARCH_DASHBOARD_TASKS:
    case ActionTypes.GET_DASHBOARD_TASKS:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS:
    case ActionTypes.SEARCH_DASHBOARD_TASKS_SUCCESS:
    case ActionTypes.GET_DASHBOARD_TASKS_SUCCESS:
      return {
        ...state,
        tasksList,
        isLoading: false,
      };

    case ActionTypes.GET_DASHBOARD_GROUPS_FAILURE:
    case ActionTypes.SEARCH_DASHBOARD_TASKS_FAILURE:
    case ActionTypes.GET_DASHBOARD_TASKS_FAILURE:
      return {
        ...state,
        error,
        isLoading: false,
      };

    case ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === action.groupType,
      );

      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...groupToUpdate,
        isLoading: true,
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case ActionTypes.GET_DASHBOARD_TASKS_FOR_GROUP_SUCCESS: {
      const { groupType, group } = action;

      const groupToUpdate = state?.tasksList?.find(
        g => g.groupType === groupType,
      );
      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...groupToUpdate,
        ...group,
        isLoading: false,
        tasks: group.tasks,
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === action.groupType,
      );
      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...groupToUpdate,
        isLoadingMore: true,
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case ActionTypes.LOAD_MORE_DASHBOARD_TASKS_FOR_GROUP_SUCCESS: {
      const { groupType, group } = action;

      const groupToUpdate = state?.tasksList?.find(
        g => g.groupType === groupType,
      );
      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...groupToUpdate,
        ...group,
        isLoadingMore: false,
        tasks: [...(groupToUpdate?.tasks || []), ...group.tasks],
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default DashboardTasksReducer;
