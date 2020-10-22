import * as types from 'actions/action-types';

import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tasksList: [],
  isLoading: false,
  error: '',
};

const updateTaskInList = (lists, updateTaskCallback) =>
  lists.map(group => {
    const updatedTasks = group.tasks ? updateTaskCallback(group.tasks) : [];
    return { ...group, tasks: updatedTasks };
  });

const updateTasksStateCallback = (state, updateTaskFromAction) => {
  return {
    ...state,
    tasksList: updateTaskInList(state.tasksList, updateTaskFromAction),
  };
};

const DashboardTasksReducer = (state = initialState, action) => {
  const { type, tasksList, fetchedGroup, error } = action;
  switch (type) {
    case types.REQUEST_DASHBOARD_TASKS:
      return {
        ...state,
        isLoading: true,
      };

    case types.REQUEST_DASHBOARD_TASKS_SUCCESS:
      return {
        tasksList,
        isLoading: false,
      };

    case types.REQUEST_DASHBOARD_GROUP_TASKS: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === fetchedGroup?.groupType,
      );

      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...groupToUpdate,
        isLoadingGroup: true,
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case types.REQUEST_DASHBOARD_GROUP_TASKS_SUCCESS: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === fetchedGroup?.groupType,
      );
      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...fetchedGroup,
        isLoadingGroup: false,
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case types.REQUEST_DASHBOARD_MORE_GROUP_TASKS: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === fetchedGroup?.groupType,
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

    case types.REQUEST_DASHBOARD_MORE_GROUP_TASKS_SUCCESS: {
      const groupToUpdate = state?.tasksList?.find(
        ({ groupType }) => groupType === fetchedGroup?.groupType,
      );
      const groupToUpdateIndex = state?.tasksList?.indexOf(groupToUpdate);
      const newTasksList = [...state?.tasksList];
      newTasksList[groupToUpdateIndex] = {
        ...fetchedGroup,
        isLoadingMore: false,
        tasks: [...groupToUpdate?.tasks, ...fetchedGroup?.tasks],
      };

      return {
        ...state,
        tasksList: newTasksList,
      };
    }

    case types.REQUEST_DASHBOARD_TASKS_FAILURE:
      return {
        ...state,
        error,
        isLoading: false,
      };

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default DashboardTasksReducer;
