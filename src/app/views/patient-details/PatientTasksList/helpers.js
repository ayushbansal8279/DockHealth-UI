import { TaskGroupType, TaskItemType } from 'helpers/task-helpers';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';

export const checkIfSelectedListIsPresent = (lists, selectedListIdentifier) =>
  selectedListIdentifier &&
  !lists.some(
    ({ taskListIdentifier }) => selectedListIdentifier === taskListIdentifier,
  );

export const searchTaskInPatientLists = (patientLists, searchValue) =>
  patientLists.reduce((accumulator, currentValue) => {
    const filteredTasks = filterTasksBySearchValue(
      currentValue.tasks,
      searchValue,
    );

    if (filteredTasks.length === 0) return accumulator;

    return [...accumulator, { ...currentValue, tasks: filteredTasks }];
  }, []);

export function groupTasks(tasks) {
  const groupedTasks = tasks?.reduce(
    (accumulator, item) => {
      const group = (item.itemType === TaskItemType.BUNDLE
        ? item.tasks?.[0]
        : item
      ).taskGroups.find(({ groupType }) =>
        [TaskGroupType.TASKLIST, TaskGroupType.TASKLIST_DEFAULT].includes(
          groupType,
        ),
      );

      const groupId =
        group?.groupType === TaskGroupType.TASKLIST
          ? group.taskGroupIdentifier
          : TaskGroupType.TASKLIST_DEFAULT;

      return {
        ...accumulator,
        [groupId]: {
          ...(accumulator[groupId] ?? {}),
          ...(group ?? {}),
          tasks: [...(accumulator[groupId]?.tasks ?? []), item],
        },
      };
    },
    {
      [TaskGroupType.TASKLIST_DEFAULT]: {},
    },
  );

  return !groupedTasks ? tasks : Object.values(groupedTasks);
}
