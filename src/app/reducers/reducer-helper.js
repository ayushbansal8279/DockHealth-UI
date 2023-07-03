import { TaskItemType } from 'helpers/task-helpers';

export function updateTasksStateCallback(state, newTask) {
  if (typeof newTask === 'function') return state;

  const newMap = {};
  if (newTask.itemType === TaskItemType.TASK) {
    newMap[newTask.identifier ?? newTask.taskIdentifier] = newTask;
    if (newTask.subtasks) {
      for (const subTask of newTask.subtasks) {
        newMap[subTask.identifier] = subTask;
      }
    }
    if (newTask.parentTaskIdentifier && !state.tasksMap[newTask.identifier]) {
      // if subtask is added
      const parentTask = state.tasksMap[newTask.parentTaskIdentifier];
      newMap[newTask.parentTaskIdentifier] = {
        ...parentTask,
        subtasks: parentTask.subtasks.concat([newTask]),
      };
    }
  } else {
    newMap[newTask.identifier] = {
      ...state.tasksMap[newTask.identifier],
      ...newTask,
    };
  }

  return {
    ...state,
    tasksMap: {
      ...state.tasksMap,
      ...newMap,
    },
  };
}
