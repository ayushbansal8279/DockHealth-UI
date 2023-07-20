import isEmpty from 'ramda/src/isEmpty';

export const determineTaskCounts = ({
  selectedFilters,
  isFetching,
  tasks,
  tasksCount,
  status,
}) =>
  selectedFilters && !isEmpty(selectedFilters) && !isFetching
    ? tasks?.reduce(
        (counter, task) =>
          counter +
          task.subtasks?.filter((x) => x.status === status).length +
          1,
        0,
      ) || 0
    : tasksCount;
