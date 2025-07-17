import * as ActionTypes from 'actions/action-types';
import TaskBaseReducer from 'reducers/task-base-reducer';
import { updateTasksStateCallback } from 'reducers/reducer-helper';
import { TaskItemType } from '../helpers/task-helpers';
import { updateWorkflowInState } from './patient-details-reducer';

const initial = {
  lists: null,
  tasksMap: {},
  isFetching: false,
};

export const updateProfileTaskOrSubtaskInListsArray = (
  lists,
  newTaskData,
  taskIdentifier
) =>
  lists?.map((list) => {
    const updatedTasks = updateProfileTaskOrSubtask(
      list.tasks,
      taskIdentifier,
      newTaskData
    );
    return { ...list, tasks: updatedTasks };
  });

export const updateProfileTaskOrSubtask = (
  tasks,
  taskIdentifier,
  newTaskData
) =>
  tasks?.map((task) => {
    let updatedSubtasks = [];
    if (task.subtasks?.length) {
      updatedSubtasks = updateProfileTaskOrSubtask(
        task.subtasks,
        taskIdentifier,
        newTaskData
      );
    }

    if (task.identifier === taskIdentifier) {
      return {
        ...task,
        ...newTaskData,
        subtasks: updatedSubtasks,
      };
    }

    return {
      ...task,
      subtasks: updatedSubtasks,
    };
  });

const updateProfileTaskReducer = (state, updatedTaskData, taskIdentifier) => {
  const updatedLists = updateProfileTaskOrSubtaskInListsArray(
    state.lists,
    updatedTaskData,
    taskIdentifier
  );

  const updatedTaskMap = {
    ...state.tasksMap,
    [taskIdentifier]: {
      ...state.tasksMap[taskIdentifier],
      ...updatedTaskData,
    },
  };

  return {
    ...state,
    lists: updatedLists,
    tasksMap: updatedTaskMap,
  };
};

export default (state = initial, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ActionTypes.GET_CURRENT_PROFILE_TASKS: {
      return {
        ...state,
        lists: [],
        tasksMap: {},
        isFetching: true,
      };
    }

    case ActionTypes.UPDATE_PARTIAL_WORKFLOW_SUCCESS: {
      return updateWorkflowInState(
        action.taskWorkflowIdentifier,
        action.newData,
        state,
      );
    }

    case ActionTypes.FIND_TASKS_BY_PROFILE_GROUPED_BY_TASK_LIST_SUCCESS: {
      const newMap = {};

      for (const list of action.lists || []) {
        for (const taskItem of list.tasks || []) {
          if (taskItem.itemType === TaskItemType.TASK) {
            newMap[taskItem.identifier] = taskItem;

            for (const subtask of taskItem.subtasks || []) {
              newMap[subtask.identifier] = subtask;
            }
          } else {
            for (const groupTask of taskItem.tasks || []) {
              newMap[groupTask.identifier] = groupTask;

              for (const subtask of groupTask.subtasks || []) {
                newMap[subtask.identifier] = subtask;
              }
            }

            newMap[taskItem.identifier] = {
              ...taskItem,
              tasks: taskItem.tasks?.map((t) => t.identifier),
            };
          }
        }
      }

      return {
        ...state,
        lists: action.lists || [],
        tasksMap: newMap,
        isFetching: false,
      };
    }

    case ActionTypes.UPDATE_TASK_SUCCESS: {
      const { task } = action;

      if (!task || !task.taskIdentifier) return state;

      const { taskIdentifier, ...updatedTaskData } = task;
      return updateProfileTaskReducer(state, updatedTaskData, taskIdentifier);
    }

    case ActionTypes.ADD_TASK_SUCCESS: {
      const { task: addedTask } = action;
      const { taskListIdentifier } = addedTask.taskList || {};

      // const bundleIdentifier = addedTask.taskGroups?.find(
      //   ({ groupType }) => groupType === TaskGroupType.BUNDLE,
      // )?.taskGroupIdentifier;

      // if (bundleIdentifier) {
      //   return {
      //     ...state,
      //     lists: state.lists?.map((l) => ({
      //       ...l,
      //       tasks: l.tasks?.map((t) =>
      //         t.identifier === bundleIdentifier
      //           ? { ...t, tasks: [...(t.tasks || []), addedTask] }
      //           : t,
      //       ),
      //     })),
      //   };
      // }

      const listToUpdate = state.lists?.find(
        (l) => l.taskListIdentifier === taskListIdentifier
      );

      let updatedLists;

      if (listToUpdate) {
        updatedLists = state.lists?.map((l) =>
          l.taskListIdentifier === taskListIdentifier
            ? {
                ...l,
                tasks: [addedTask, ...(l.tasks || [])],
              }
            : l
        );
      } else {
        const newList = {
          taskListIdentifier,
          tasks: [addedTask],
        };

        updatedLists = [...(state.lists || []), newList];
      }

      const updatedState = {
        ...state,
        lists: updatedLists,
      };

      return updateTasksStateCallback(updatedState, addedTask);
    }

    case ActionTypes.UPDATE_PROFILE_TASK: {
      const { updatedTaskData, taskIdentifier } = action.payload;

      return updateProfileTaskReducer(state, updatedTaskData, taskIdentifier);
    }

    default: {
      return state.profileIdentifier && state.profileIdentifier !== ''
        ? TaskBaseReducer(state, action, updateTasksStateCallback)
        : state;
    }
  }
};
