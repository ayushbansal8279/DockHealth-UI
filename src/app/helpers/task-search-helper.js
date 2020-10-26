import { pluck } from 'ramda';

export const filterTasksBySearchValue = (tasks, searchValue) => {
  const searchedTasks = [];

  tasks.forEach(parentTask => {
    const { description, comments, patient, assignedTo, subtasks } = parentTask;

    const parentTaskIncludeSearchedValue =
      description.toLowerCase().includes(searchValue.toLowerCase()) ||
      pluck('comment', comments).filter(s =>
        new RegExp(searchValue.toLowerCase(), 'ig').test(s),
      ).length > 0 ||
      patient?.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
      assignedTo?.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
      assignedTo?.lastName.toLowerCase().includes(searchValue.toLowerCase());

    const searchedSubtasks = subtasks
      .filter(
        ({
          description: subtaskDescription,
          comments: subtaskComments,
          assignedTo: subtaskAssignedTo,
        }) => {
          return (
            subtaskDescription
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            pluck('comment', subtaskComments).filter(s =>
              new RegExp(searchValue.toLowerCase(), 'ig').test(s),
            ).length > 0 ||
            subtaskAssignedTo?.firstName
              .toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            subtaskAssignedTo?.lastName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        },
      )
      .map(subtask => ({ ...subtask, parentTask }));

    if (parentTaskIncludeSearchedValue) {
      searchedTasks.push({
        ...parentTask,
        subtasks: searchedSubtasks,
      });
    } else {
      searchedSubtasks.forEach(filteredSubtask =>
        searchedTasks.push(filteredSubtask),
      );
    }
  });

  return searchedTasks;
};

export default filterTasksBySearchValue;
