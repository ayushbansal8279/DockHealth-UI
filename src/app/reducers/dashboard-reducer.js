import * as ActionTypes from 'actions/action-types';
import { getGroupByDueDate } from 'helpers/dashboard-helpers';
import { TaskItemType } from 'helpers/task-helpers';
import { updateTasksStateCallback } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  tabName: null,
  searchValue: '',
  tasksList: [],
  tasksMap: {},
  isLoading: false,
  error: '',
  lastCreatedTaskIdentifier: null,
  selectedFilters: null,
  filterOptions: null,
  isFetchingFilters: false,
  filterOptionsError: false,
};

const addTask = (list, taskToAdd) => {
  const { tasks = [] } = list;
  return {
    ...list,
    tasks: [taskToAdd, ...tasks],
    metricValue: tasks.length + 1,
  };
};

const findAndAddTask = ({ lists, groupType: type, task: taskToAdd }) =>
  lists.map((list) =>
    list.groupType === type ? addTask(list, taskToAdd) : list,
  );

const getMapOfLoadedTasks = (group) => {
  const { tasks } = group;
  const newMap = {};
  for (const task of tasks) {
    if (task.itemType === TaskItemType.TASK) {
      newMap[task.identifier] = task;
      if (task?.parentTask) {
        newMap[task?.parentTask?.identifier] = task?.parentTask;
      }
    } else {
      newMap[task.identifier] = task;
      for (const grpTask of task.tasks) {
        newMap[grpTask.identifier] = grpTask;
      }
    }
  }
  return newMap;
};

const updateGroupsWithGroupTasksLoad = (tasksList, group, groupType) => {
  const groupToUpdate = tasksList?.find((g) => g.groupType === groupType);
  const groupToUpdateIndex = tasksList?.indexOf(groupToUpdate);
  const newTasksList = [...tasksList];
  newTasksList[groupToUpdateIndex] = {
    ...groupToUpdate,
    ...group,
    tasks: group.tasks.map((task) => task.identifier),
    isLoading: false,
  };
  return newTasksList;
};

const updateGroupsWithGroupTasksLoadMore = (tasksList, group, groupType) => {
  const groupToUpdate = tasksList?.find((g) => g.groupType === groupType);
  const groupToUpdateIndex = tasksList?.indexOf(groupToUpdate);
  const newTasksList = [...tasksList];
  newTasksList[groupToUpdateIndex] = {
    ...groupToUpdate,
    ...group,
    tasks: [
      ...(groupToUpdate?.tasks || []),
      ...group.tasks?.map((task) => task.identifier),
    ],
    isLoadingMore: false,
  };
  return newTasksList;
};

function updateBundleInState(bundleIdentifier, updatedData, state) {
  const updatedMap = {
    [bundleIdentifier]: {
      ...state.tasksMap[bundleIdentifier],
      ...updatedData,
      tasks: [
        ...new Set([
          ...(state.tasksMap[bundleIdentifier]?.tasks || []),
          ...updatedData?.tasks.map((task) => task.identifier),
        ]),
      ],
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
const DashboardTasksReducer = (state = initialState, action) => {
  const { type, tasksList, error } = action;
  switch (type) {
    case ActionTypes.INITIALIZE_DASHBOARD_STATE: {
      return {
        ...state,
        ...initialState,
        tabName: action.tabName,
      };
    }

    case ActionTypes.CLEAR_DASHBOARD_STATE: {
      return {
        ...initialState,
      };
    }

    case ActionTypes.GET_DASHBOARD_FILTERS: {
      return {
        ...state,
        isFetchingFilters: true,
        filterOptionsError: false,
      };
    }

    case ActionTypes.GET_DASHBOARD_FILTERS_SUCCESS: {
      return {
        ...state,
        filterOptions: action.filters,
        isFetchingFilters: false,
        filterOptionsError: false,
      };
    }

    case ActionTypes.GET_DASHBOARD_FILTERS_FAILURE: {
      return {
        ...state,
        filterOptions: null,
        isFetchingFilters: false,
        filterOptionsError: true,
      };
    }

    case ActionTypes.GET_DASHBOARD_GROUPS:
    case ActionTypes.GET_DASHBOARD_TASKS: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ActionTypes.SEARCH_DASHBOARD_TASKS: {
      return {
        ...state,
        isLoading: true,
        searchValue: action.searchTerm,
      };
    }

    case ActionTypes.GET_DASHBOARD_GROUP_STATS_SUCCESS: {
      return {
        ...state,
        tasksList: state.tasksList?.map((g) => {
          const matchingGroup = tasksList?.filter(
            (tg) => tg.groupType === g.groupType,
          );
          return {
            ...g,
            metricValue: matchingGroup ? matchingGroup[0].metricValue : 0,
          };
        }),
        isLoading: false,
      };
    }

    case ActionTypes.GET_DASHBOARD_GROUPS_SUCCESS: {
      return {
        ...state,
        tasksList,
        isLoading: false,
      };
    }

    case ActionTypes.SEARCH_DASHBOARD_TASKS_SUCCESS:
    case ActionTypes.GET_DASHBOARD_TASKS_SUCCESS: {
      let newMap = {};
      for (const group of tasksList) {
        const tasksMapForGroup = getMapOfLoadedTasks(group);
        newMap = {
          ...newMap,
          ...tasksMapForGroup,
        };
      }

      return {
        ...state,
        tasksList,
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
        isLoading: false,
      };
    }

    case ActionTypes.GET_DASHBOARD_GROUPS_FAILURE:
    case ActionTypes.SEARCH_DASHBOARD_TASKS_FAILURE:
    case ActionTypes.GET_DASHBOARD_TASKS_FAILURE: {
      return {
        ...state,
        error,
        isLoading: false,
      };
    }

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

      const newMap = getMapOfLoadedTasks(group);
      const newTasksList = updateGroupsWithGroupTasksLoad(
        state?.tasksList,
        group,
        groupType,
      );

      return {
        ...state,
        tasksList: newTasksList,
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
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

      const newMap = getMapOfLoadedTasks(group);
      const newTasksList = updateGroupsWithGroupTasksLoadMore(
        state?.tasksList,
        group,
        groupType,
      );

      return {
        ...state,
        tasksList: newTasksList,
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
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
        tasksList: state.tasksList?.map((g) => {
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

      const updatedStateAfterRemovingTaskItem = {
        ...state,
        tasksList: state.tasksList.map((g) => {
          const newTasks = g.tasks?.filter(
            (taskId) => taskId !== taskIdentifier,
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

      return state.tabName && state.tabName !== ''
        ? TaskBaseReducer(
            updatedStateAfterRemovingTaskItem,
            action,
            updateTasksStateCallback,
          )
        : state;
    }

    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      return updateBundleInState(
        action.taskWorkflowIdentifier,
        action.newData,
        state,
      );
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task } = action;
      const groupType = getGroupByDueDate(task.dueDate, state.tabName);
      const updatedState = {
        ...state,
        lastCreatedTaskIdentifier: action?.task?.identifier,
        tasksList: findAndAddTask({ lists: state.tasksList, groupType, task }),
      };

      return updateTasksStateCallback(updatedState, task);
    }

    default: {
      return state.tabName && state.tabName !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};

export default DashboardTasksReducer;
