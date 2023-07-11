import { TaskItemType } from 'helpers/task-helpers';

function updateTaskItemSubTasks(state, tasksMap, taskItem) {
  const updatedMap = tasksMap;
  if (taskItem.subtasks) {
    for (const subTask of taskItem.subtasks) {
      updatedMap[subTask.identifier] = subTask;
    }
  }
  if (taskItem?.parentTaskIdentifier && !state.tasksMap[taskItem.identifier]) {
    // if subtask is added
    const parentTask = state.tasksMap[taskItem.parentTaskIdentifier];
    updatedMap[taskItem.parentTaskIdentifier] = {
      ...parentTask,
      subtasks: parentTask?.subtasks.concat([taskItem]),
    };
  }
  return updatedMap;
}

// taskData -- is either task data to update or a finction to get the updated task
// eslint-disable-next-line sonarjs/cognitive-complexity
export function updateTasksStateCallback(state, taskData) {
  let taskItem = taskData;
  if (typeof taskData === 'function') {
    taskItem = taskData(state.tasksMap);
  }
  const newMap = {};
  if (taskItem) {
    if (taskItem?.itemType) {
      if (taskItem?.itemType === TaskItemType.TASK) {
        newMap[taskItem.identifier ?? taskItem.taskIdentifier] = taskItem;
        updateTaskItemSubTasks(state, newMap, taskItem);
      } else {
        newMap[taskItem.identifier] = {
          ...state.tasksMap[taskItem.identifier],
          ...taskItem,
        };
        for (const bundleTask of taskItem.tasks) {
          updateTaskItemSubTasks(state, newMap, bundleTask);
        }
      }
    } else if (taskItem.taskIdentifier) {
      newMap[taskItem.taskIdentifier] = {
        ...state.tasksMap[taskItem.taskIdentifier],
        ...taskItem,
      };
      updateTaskItemSubTasks(state, newMap, newMap[taskItem.taskIdentifier]);
    }
  }

  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      ...newMap,
    },
  };
}
