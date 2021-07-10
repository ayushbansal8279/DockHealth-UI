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
