/* eslint-disable import/prefer-default-export */
import { isEmpty } from 'ramda';
import { TaskItemType } from './task-helpers';

function checkIfTaskAndSubtasksSelected(task) {
  return (
    task.selected &&
    (!task.subtasks || task.subtasks.every(subtask => subtask.selected))
  );
}

export function checkIfAllTasksSelected(tasks) {
  if (!tasks || isEmpty(tasks)) {
    return false;
  }

  return tasks.every(task => {
    if (task.itemType === TaskItemType.BUNDLE) {
      if (!task.tasks || isEmpty(task.tasks)) {
        return false;
      }
      return task.tasks.every(bundleTask =>
        checkIfTaskAndSubtasksSelected(bundleTask),
      );
    }

    return checkIfTaskAndSubtasksSelected(task);
  });
}
