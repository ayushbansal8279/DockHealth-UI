/* eslint-disable import/prefer-default-export */
import { TaskItemType } from './task-helpers';

function checkIfTaskAndSubtasksSelected(task) {
  return (
    task.selected &&
    (!task.subtasks || task.subtasks.every(subtask => subtask.selected))
  );
}

export function checkIfAllTasksSelected(tasks) {
  return tasks.every(task => {
    if (task.itemType === TaskItemType.BUNDLE) {
      return task.tasks.every(bundleTask =>
        checkIfTaskAndSubtasksSelected(bundleTask),
      );
    }

    return checkIfTaskAndSubtasksSelected(task);
  });
}
