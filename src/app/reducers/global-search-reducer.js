import * as types from 'actions/action-types';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
import { TaskItemType } from 'helpers/task-helpers';
import { updateTasksStateCallback, updateTasksMap } from './reducer-helper';
import TaskBaseReducer from './task-base-reducer';

const initialState = {
  isSearchingCompletedTasks: false,
  searchValue: '',
  lists: [],
  tasksMap: {},
  isLoading: false,
  isLoadingMore: false,
  searchPerformed: false,
  error: '',
};

function updateBundleInState(bundleIdentifier, updatedData, state) {
  const updatedMap = {
    [bundleIdentifier]: {
      // ...state.tasksMap[bundleIdentifier],
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

const GlobalSearchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.SEARCH_COMPLETED_TASKS: {
      return {
        ...state,
        isSearchingCompletedTasks: true,
      };
    }

    case types.SEARCH_INCOMPLETED_TASKS: {
      return {
        ...state,
        isSearchingCompletedTasks: false,
      };
    }

    case types.SET_SEARCH_VALUE: {
      return {
        ...state,
        searchValue: payload?.value,
        searchPerformed: false,
      };
    }

    case types.GLOBAL_SEARCH_REQUEST: {
      return {
        ...state,
        isLoading: true,
        searchPerformed: false,
      };
    }

    case types.DELETE_TASK: {
      const { taskIdentifier } = action;
      const taskItem = state.tasksMap[taskIdentifier];

      const { taskListIdentifier } = taskItem?.taskList || {};

      const updatedStateAfterRemovingTaskItem =
        taskItem?.itemType === TaskItemType.BUNDLE
          ? {
              ...state,
            }
          : {
              ...state,
              lists: state.lists?.map((l) =>
                l.taskListIdentifier === taskListIdentifier
                  ? {
                      ...l,
                      tasks: l.tasks?.filter(
                        (task) => task?.taskIdentifier !== taskIdentifier,
                      ),
                    }
                  : l,
              ),
            };

      return state.searchPerformed && state.searchPerformed !== ''
        ? TaskBaseReducer(
            updatedStateAfterRemovingTaskItem,
            action,
            updateTasksStateCallback,
          )
        : state;
    }

    case types.DELETE_WORKFLOW: {
      const { identifier } = action;

      return {
        ...state,
        lists: state.lists?.map((l) => ({
          ...l,
          tasks: l.tasks?.filter(({ identifier: id }) => id !== identifier),
        })),
      };
    }

    case types.GLOBAL_SEARCH_REQUEST_SUCCESS: {
      const { payload } = action;

      var newMap = {};
      if (payload?.lists) {
        for (const list of payload?.lists) {
          for (const taskItem of list?.tasks) {
            newMap = {
              ...newMap,
              ...updateTasksMap(state, taskItem),
            };
          }
        }
      }

      return {
        ...state,
        lists: payload?.lists,
        tasksMap: {
          ...state.tasksMap,
          ...newMap,
        },
        isLoading: false,
        searchPerformed: true,
      };
    }

    case types.GLOBAL_SEARCH_MORE_REQUEST: {
      return {
        ...state,
        isLoadingMore: true,
      };
    }

    case types.GLOBAL_SEARCH_MORE_REQUEST_SUCCESS: {
      return {
        ...state,
        lists: state.lists?.map((list) => {
          const matchingList = payload.lists?.find(
            ({ taskListIdentifier }) =>
              taskListIdentifier === list?.taskListIdentifier,
          );

          if (matchingList) {
            return {
              ...list,
              tasks: list.tasks.concat(matchingList.tasks),
              hasMore: matchingList.hasMore,
            };
          }

          return {
            ...list,
          };
        }),
        isLoadingMore: false,
      };
    }

    case types.UPDATE_GLOBAL_SEARCH_TASK: {
      const { task } = payload;
      return {
        ...state,
        lists: updateTaskOrSubtaskInListsArray(
          state.lists,
          task,
          task.taskIdentifier,
        ),
      };
    }

    case types.RESET_GLOBAL_SEARCH: {
      return {
        ...state,
        ...initialState,
        searchPerformed: false,
        lists: [],
      };
    }

    case types.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      return updateBundleInState(
        action.taskWorkflowIdentifier,
        action.newData,
        state,
      );
    }

    default: {
      return state.searchPerformed && state.searchPerformed !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};

export default GlobalSearchReducer;
