import * as types from 'actions/action-types';
import { updateTaskOrSubtaskInListsArray } from 'helpers/task-update-helper';
import { TaskItemType } from 'helpers/task-helpers';
// import { mapWithRemove } from 'helpers/utility-functions';
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

// const updateTaskInList = (lists, updateTaskCallback) =>
//   lists.map((list) => ({
//     ...list,
//     tasks: mapWithRemove(updateTaskCallback, list.tasks),
//   }));

// const updateTasksStateCallback = (state, updateTaskFromAction) => ({
//   ...state,
//   lists: updateTaskInList(state.lists, updateTaskFromAction),
// });

const updateTasksStateCallback = (state, newTask) => {
  if (typeof newTask === 'function') return state;

  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      [newTask.identifier ?? newTask.taskIdentifier]: {
        ...state.tasksMap[newTask.identifier ?? newTask.taskIdentifier],
        ...newTask,
      },
    },
  };
};

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

    case types.GLOBAL_SEARCH_REQUEST_SUCCESS: {
      const tasks = action.lists;
      const newMap = {};
      for (const task of tasks) {
        if (task.itemType === TaskItemType.TASK) {
          newMap[task.identifier] = task;
        } else {
          newMap[task.identifier] = task;
          for (const subtask of task.tasks) {
            newMap[subtask.identifier] = subtask;
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

    default: {
      return TaskBaseReducer(state, action, updateTasksStateCallback);
    }
  }
};

export default GlobalSearchReducer;
