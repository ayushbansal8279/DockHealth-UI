import { partial, pluck } from 'ramda';
import { TaskItemType } from './task-helpers';

export function checkIfTaskMatchSearchValue(searchValue, task) {
  const { description, comments, patient, assignedTo, workflowStatus } = task;
  const workflowStatusName = workflowStatus ? workflowStatus.name : 'No status';

  return !!(
    description?.toLowerCase().includes(searchValue.toLowerCase()) ||
    pluck('comment', comments).filter(s =>
      new RegExp(searchValue.toLowerCase(), 'ig').test(s),
    ).length > 0 ||
    patient?.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
    patient?.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
    assignedTo?.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
    assignedTo?.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
    workflowStatusName.toLowerCase().includes(searchValue.toLowerCase())
  );
}

export function filterTasksBySearchValue(tasks, searchValue) {
  if (!searchValue) return tasks;

  if (!tasks) return [];

  return tasks.reduce((accumulator, parentTask) => {
    const { itemType } = parentTask;

    if (itemType === TaskItemType.BUNDLE) {
      return [
        ...accumulator,
        ...filterTasksBySearchValue(parentTask.tasks, searchValue),
      ];
    }

    const checkIfTaskMatchSearch = partial(checkIfTaskMatchSearchValue, [
      searchValue,
    ]);

    const parentTaskIncludeSearchedValue = checkIfTaskMatchSearch(parentTask);

    const { subtasks } = parentTask;

    const searchedSubtasks = subtasks
      ? subtasks.filter(checkIfTaskMatchSearch)
      : [];

    if (parentTaskIncludeSearchedValue) {
      return [
        ...accumulator,
        {
          ...parentTask,
          subtasks: searchedSubtasks,
        },
      ];
    }

    return [...accumulator, ...searchedSubtasks];
  }, []);
}

export default filterTasksBySearchValue;
