import * as ActionTypes from 'actions/action-types';
import { getGroupByDueDate } from 'helpers/dashboard-helpers';
import { mapWithRemove } from 'helpers/utility-functions';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tabName: null,
  searchValue: '',
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
    case ActionTypes.GET_DASHBOARD_TASKS:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.SEARCH_DASHBOARD_TASKS:
      return {
        ...state,
        isLoading: true,
        searchValue: action.searchTerm,
      };

    case ActionTypes.GET_DASHBOARD_GROUP_STATS_SUCCESS:
      return {
        ...state,
        tasksList: state.tasksList?.map(g => {
          const matchingGroup = tasksList?.filter(
            tg => tg.groupType === g.groupType,
          );
          return {
            ...g,
            metricValue: matchingGroup ? matchingGroup[0].metricValue : 0,
          };
        }),
        isLoading: false,
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

    case ActionTypes.INSERT_CREATED_TASK_SUCCESS: {
      if (!state.tabName) {
        return { ...state };
      }

      const { task } = action;
      const groupType = getGroupByDueDate(task.dueDate, state.tabName);

      return {
        ...state,
        tasksList: state.tasksList?.map(g => {
          if (
            g.groupType === groupType &&
            !g.tasks.some(
              ({ taskIdentifier }) => taskIdentifier === task.taskIdentifier,
            )
          ) {
            return {
              ...g,
              tasks: [task, ...(g.tasks || [])],
            };
          }

          return g;
        }),
      };
    }

    case ActionTypes.DELETE_TASK: {
      const { taskIdentifier } = action;

      return {
        ...state,
        tasksList: state.tasksList.map(g => {
          const newTasks = g.tasks?.filter(
            ({ identifier }) => identifier !== taskIdentifier,
          );
          return {
            ...g,
            tasks: newTasks,
            metricValue:
              newTasks?.length === g.tasks?.length
                ? g.metricValue
                : g.metricValue - 1,
          };
        }),
      };
    }

    default:
      return TaskBaseReducer(state, action, updateTasksStateCallback);
  }
};

export default DashboardTasksReducer;
