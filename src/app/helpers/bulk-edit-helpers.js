import isEmpty from 'ramda/src/isEmpty';
import { TaskItemType } from './task-helpers';

export function checkIfTaskAndSubtasksSelected(task) {
  return (
    task.selected &&
    (!task.subtasks || task.subtasks.every((subtask) => subtask.selected))
  );
}

export function checkIfAllTasksSelected(tasks) {
  if (!tasks || isEmpty(tasks)) {
    return false;
  }

  return tasks.every((task) => {
    if (task.itemType === TaskItemType.BUNDLE) {
      if (task.selected) return true;
      if (!task.tasks || isEmpty(task.tasks)) {
        return false;
      }
      return task.tasks.every((bundleTask) =>
        checkIfTaskAndSubtasksSelected(bundleTask),
      );
    }

    return checkIfTaskAndSubtasksSelected(task);
  });
}

export const BulkEditOptionsConfig = {
  DUPLICATE_OPTION: 'BulkEditDuplicateOption',
  MOVE_OPTION: 'BulkEditMoveOption',
  COMPLETE_OPTION: 'BulkEditCompleteOption',
  EDIT_CUSTOM_FIELDS_OPTION: 'BulkEditCustomFieldsOption',
  STATUS_OPTION: 'BulkEditStatusOption',
  DUE_DATE_OPTION: 'BulkEditDueDateOption',
  ASSIGN_OPTION: 'BulkEditAssignOption',
  DELETE_OPTION: 'BulkEditDeleteOption',
};

const isCreatorOrIsAssigneeToAllSelectedTasks = (
  allSelectedTasks,
  currentUser,
) => {
  const currentUserIdentifier = currentUser.userIdentifier;
  return allSelectedTasks.every((task) => {
    const isCreator = task.creator.userIdentifier === currentUserIdentifier;

    const isAssigned = task.assignedToUsers.some(
      (user) => user.userIdentifier === currentUserIdentifier,
    );

    return isCreator || isAssigned;
  });
};

export const validateNonAssigneeCompleteDisabled = (
  selectedOrganization,
  allSelectedTasks,
  currentUser,
  isListAdmin,
) => {
  const nonAssigneeCompleteDisabledItem =
    selectedOrganization?.themeSettings?.find(
      ({ name }) => name === 'list.tasks.non-assignee.complete.enabled',
    ) || {};

  return (
    nonAssigneeCompleteDisabledItem &&
    nonAssigneeCompleteDisabledItem?.value === 'false' &&
    !isCreatorOrIsAssigneeToAllSelectedTasks(allSelectedTasks, currentUser) &&
    !isListAdmin
  );
};
