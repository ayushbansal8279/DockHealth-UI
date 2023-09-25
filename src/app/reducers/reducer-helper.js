import { TaskItemType } from 'helpers/task-helpers';

// eslint-disable-next-line sonarjs/cognitive-complexity
function updateTaskItemSubTasks(state, tasksMap, taskItem) {
  const updatedMap = tasksMap;
  const taskIdentifier = taskItem.identifier ?? taskItem.taskIdentifier;

  if (taskItem.subtasks) {
    for (const subTask of taskItem.subtasks) {
      updatedMap[subTask.identifier] = subTask;
    }
  }
  if (taskItem?.parentTaskIdentifier) {
    // if subtask is added
    let parentTask = state.tasksMap[taskItem.parentTaskIdentifier];
    if (taskItem?.parentTask && !parentTask) {
      parentTask = taskItem?.parentTask;
      updatedMap[taskItem.parentTaskIdentifier] = parentTask;
    }
    if (parentTask) {
      const updateSubtasks = parentTask?.subtasks?.map((st) =>
        st?.identifier === taskItem?.identifier
          ? {
              ...st,
              ...taskItem,
            }
          : st,
      );

      updatedMap[taskItem.parentTaskIdentifier] = state.tasksMap[taskIdentifier]
        ? {
            ...parentTask,
            subtasks: updateSubtasks,
          }
        : {
            ...parentTask,
            subtasks: parentTask?.subtasks.concat([taskItem]),
          };
    }
  }
  return updatedMap;
}

// this helper method is used to update the state of the task in the map - also handles group or parent task
// taskData -- is either task data to update or a function to get the updated task
// eslint-disable-next-line sonarjs/cognitive-complexity
export function updateTasksStateCallback(state, taskData) {
  let taskItem = taskData;
  if (typeof taskData === 'function') {
    taskItem = taskData(state.tasksMap);
  }
  const taskIdentifier = taskItem?.identifier ?? taskItem?.taskIdentifier;

  const updatedMetaData = state.tasksMap[taskIdentifier]?.taskMetaData?.map(
    (tmd) => {
      const matchedTaskMetaData = taskItem?.taskMetaData?.find(
        (newtmd) =>
          newtmd && newtmd.customFieldIdentifier === tmd?.customFieldIdentifier,
      );
      return {
        ...tmd,
        ...matchedTaskMetaData,
      };
    },
  );

  const newMetaData = taskItem?.taskMetaData?.filter(
    (newtmd) =>
      state.tasksMap[taskIdentifier]?.taskMetaData?.find(
        (tmd) =>
          tmd && tmd.customFieldIdentifier === newtmd?.customFieldIdentifier,
      ) === undefined,
  );

  const mergedTaskMetaData = updatedMetaData?.concat(newMetaData);

  const newMap = {};
  // taskItem is null incase task is removed
  if (taskItem) {
    if (taskItem?.itemType) {
      if (taskItem?.itemType === TaskItemType.TASK) {
        newMap[taskIdentifier] = taskItem;
        updateTaskItemSubTasks(state, newMap, taskItem);
      } else {
        newMap[taskIdentifier] = {
          ...state.tasksMap[taskIdentifier],
          ...taskItem,
          taskMetaData: mergedTaskMetaData,
        };
        for (const bundleTask of taskItem.tasks) {
          updateTaskItemSubTasks(state, newMap, bundleTask);
        }
      }
    } else if (taskIdentifier) {
      newMap[taskIdentifier] = {
        ...state.tasksMap[taskIdentifier],
        ...taskItem,
        taskMetaData: mergedTaskMetaData,
      };
      updateTaskItemSubTasks(state, newMap, newMap[taskIdentifier]);
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

export function updateTasksMap(state, taskItem) {
  const updatedMap = {
    [taskItem?.identifier]:
      taskItem?.itemType === TaskItemType.BUNDLE
        ? {
            ...state.tasksMap[taskItem?.identifier],
            ...taskItem,
            tasks: taskItem?.tasks.map((task) => task.identifier),
          }
        : {
            ...state.tasksMap[taskItem?.identifier],
            ...taskItem,
          },
  };

  if (taskItem?.itemType === TaskItemType.BUNDLE) {
    // add tasks and subtasks in the bundle
    if (taskItem?.tasks) {
      for (const task of taskItem?.tasks) {
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
    }
  } else if (taskItem?.subtasks) {
    for (const subtask of taskItem?.subtasks) {
      updatedMap[subtask.identifier] = {
        ...updatedMap[subtask.identifier],
        ...subtask,
      };
    }
  } else if (taskItem?.parentTask) {
    updatedMap[taskItem?.parentTask?.identifier] = taskItem?.parentTask;
  }

  return updatedMap;
}
