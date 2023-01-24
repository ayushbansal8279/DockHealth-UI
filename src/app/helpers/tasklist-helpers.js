/* eslint-disable no-unused-expressions */
import { TaskItemType, TaskStatus } from './task-helpers';

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

export function extractTasksAndSubtasks(listOfTasks) {
  if (!listOfTasks) {
    return { parentTasks: [], subtasks: [] };
  }

  return listOfTasks.reduce(
    (accumulator, task) => {
      if (task.itemType === TaskItemType.BUNDLE) {
        // eslint-disable-next-line no-unused-expressions
        accumulator.parentTasks.push(task);
        if (task.tasks)
          for (const t of task.tasks) {
            if (t.parentTaskIdentifier) {
              accumulator.parentTasks.push(t);
            } else {
              accumulator.parentTasks.push(t);
              // eslint-disable-next-line no-unused-expressions
              if (t.subtasks)
                for (const subtask of t.subtasks)
                  accumulator.subtasks.push(subtask);
            }
          }
      } else if (task.parentTaskIdentifier) {
        accumulator.subtasks.push(task);
      } else {
        accumulator.parentTasks.push(task);
        // eslint-disable-next-line no-unused-expressions
        if (task.subtasks)
          for (const subtask of task.subtasks)
            accumulator.subtasks.push(subtask);
      }

      return accumulator;
    },
    { parentTasks: [], subtasks: [] },
  );
}

export function updateBundleInList(
  dataToUpdate,
  bundleIdentifier,
  listOfTasks,
  groupIdentifier,
) {
  const existingBundle = listOfTasks?.find(
    ({ identifier }) => identifier === bundleIdentifier,
  );
  if (existingBundle) {
    return listOfTasks?.map((t) =>
      t.itemType === TaskItemType.BUNDLE && t.identifier === bundleIdentifier
        ? { ...t, ...dataToUpdate }
        : t,
    );
  }
  if (
    dataToUpdate.identifier &&
    (!groupIdentifier ||
      groupIdentifier === dataToUpdate.parentTaskWorkflowIdentifier)
  ) {
    return [dataToUpdate, ...listOfTasks];
  }
  return listOfTasks;
}

export function checkIfHasIncompleteTasks(tasks) {
  return !!tasks?.some(({ status }) => status === TaskStatus.INCOMPLETE);
}
