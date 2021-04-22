import { TaskItemType } from './task-helpers';

export const TaskListTabName = {
  OPEN: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export function checkIfTasksHaveSubtasksOrComments(tasks) {
  if (tasks?.length === 0) return false;

  return tasks.find(({ subtasks, subTasksCount, comments }) => {
    if (comments?.length > 0) return true;

    if (subTasksCount > 0) return true;

    return subtasks?.find(
      ({ comments: subtaskComments }) => subtaskComments?.length > 0,
    );
  });
}

export function updateAllTaskItems(dataToUpdate, taskItems) {
  return taskItems?.map(taskItem => {
    if (taskItem.itemType === TaskItemType.BUNDLE) {
      return {
        ...taskItem,
        tasks: taskItem.tasks.map(task => ({
          ...task,
          ...dataToUpdate,
          subtasks: task.subtasks?.map(subtask => ({
            ...subtask,
            ...dataToUpdate,
          })),
        })),
      };
    }

    return {
      ...taskItem,
      ...dataToUpdate,
      subtasks: taskItem.subtasks?.map(subtask => ({
        ...subtask,
        ...dataToUpdate,
      })),
    };
  });
}

export function updateMultipleTasks(
  dataToUpdate,
  identifiersToUpdate,
  taskItems,
) {
  return taskItems?.map(taskItem => {
    if (taskItem.itemType === TaskItemType.BUNDLE) {
      return {
        ...taskItem,
        tasks: taskItem.tasks.map(task =>
          identifiersToUpdate.includes(task.identifier)
            ? {
                ...task,
                ...dataToUpdate,
                subtasks: task.subtasks?.map(subtask => ({
                  ...subtask,
                  ...dataToUpdate,
                })),
              }
            : task,
        ),
      };
    }

    if (identifiersToUpdate.includes(taskItem.identifier)) {
      return {
        ...taskItem,
        ...dataToUpdate,
        subtasks: taskItem.subtasks?.map(subtask => ({
          ...subtask,
          ...dataToUpdate,
        })),
      };
    }

    return taskItem;
  });
}

export function extractTasksAndSubtasks(listOfTasks) {
  if (!listOfTasks) {
    return { parentTasks: [], subtasks: [] };
  }

  return listOfTasks.reduce(
    (accumulator, task) => {
      if (task.itemType === TaskItemType.BUNDLE) {
        // eslint-disable-next-line no-unused-expressions
        task.tasks?.forEach(t => {
          if (t.parentTaskIdentifier) {
            accumulator.subtasks.push(t);
          } else {
            accumulator.parentTasks.push(t);
            // eslint-disable-next-line no-unused-expressions
            t.subtasks?.forEach(subtask => accumulator.subtasks.push(subtask));
          }
        });
      } else if (task.parentTaskIdentifier) {
        accumulator.subtasks.push(task);
      } else {
        accumulator.parentTasks.push(task);
        // eslint-disable-next-line no-unused-expressions
        task.subtasks?.forEach(subtask => accumulator.subtasks.push(subtask));
      }

      return accumulator;
    },
    { parentTasks: [], subtasks: [] },
  );
}
